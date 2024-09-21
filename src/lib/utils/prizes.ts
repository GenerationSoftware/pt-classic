import { clients, userClaimedPrizeEvents, userFlashEvents, userLastCheckedBlockNumber, userTransferEvents } from '$lib/stores'
import { formatEther, formatUnits, type Address, type ContractFunctionParameters } from 'viem'
import { prizeHook, prizePool, prizeVault } from '$lib/config'
import { prizePoolABI, twabControllerABI } from '$lib/abis'
import { validateClientNetwork } from './providers'
import { getBlockTimestamp } from './time'
import { getTokenPrice } from './tokens'
import { seconds } from '$lib/constants'
import { lower } from './formatting'
import { get } from 'svelte/store'
import type { UncheckedPrize } from '$lib/types'

export const getPrizeDistribution = async () => {
  const prizeDistribution: { tier: number; size: bigint; drawFrequency: number }[] = []

  const publicClient = get(clients).public
  validateClientNetwork(publicClient)

  const numberOfTiers = await publicClient.readContract({ address: prizePool.address, abi: prizePoolABI, functionName: 'numberOfTiers' })
  const prizeTiers = [...Array(numberOfTiers - 2).keys()]

  // @ts-ignore
  const multicall = await publicClient.multicall({
    contracts: [
      ...prizeTiers.map((tier) => ({
        address: prizePool.address,
        abi: prizePoolABI,
        functionName: 'getTierPrizeSize',
        args: [tier]
      })),
      ...prizeTiers.map((tier) => ({
        address: prizePool.address,
        abi: prizePoolABI,
        functionName: 'getTierAccrualDurationInDraws',
        args: [tier]
      }))
    ]
  })

  if (multicall.every((entry) => entry.status === 'success' && (typeof entry.result === 'bigint' || typeof entry.result === 'number'))) {
    prizeTiers.forEach((tier, i) => {
      const size = multicall[i].result as bigint
      const accrualDuration = multicall[i + prizeTiers.length].result as number

      const prizeCount = 4 ** i
      const drawFrequency = prizeCount / accrualDuration

      prizeDistribution.push({ tier, size, drawFrequency })
    })
  }

  return prizeDistribution
}

export const getUserUncheckedPrizes = async (userAddress: Address, options?: { checkBlockNumber?: bigint }) => {
  const uncheckedPrizes: { list: UncheckedPrize[]; queriedAtBlockNumber: bigint } = { list: [], queriedAtBlockNumber: 0n }

  const publicClient = get(clients).public
  validateClientNetwork(publicClient)

  // TODO: make sure this is the first event
  const firstDepositEvent = get(userTransferEvents)?.find(
    (e) => lower(e.args.to) === lower(userAddress) && lower(e.args.from) !== prizeHook.address
  )

  const minBlockNumber =
    get(userLastCheckedBlockNumber) || (!!firstDepositEvent ? BigInt(firstDepositEvent.blockNumber) : prizeVault.deployedAtBlock)
  const maxBlockNumber = options?.checkBlockNumber ?? (await publicClient.getBlockNumber())

  uncheckedPrizes.queriedAtBlockNumber = maxBlockNumber

  if (minBlockNumber >= maxBlockNumber) return uncheckedPrizes

  const minTimestamp = await getBlockTimestamp(minBlockNumber)
  const maxTimestamp = await getBlockTimestamp(maxBlockNumber)

  if (minTimestamp >= maxTimestamp) return uncheckedPrizes

  const relevantFlashEvents = get(userFlashEvents)?.filter((e) => BigInt(e.blockNumber) > minBlockNumber) ?? []
  const relevantClaimedPrizeEvents = get(userClaimedPrizeEvents)?.filter((e) => BigInt(e.blockNumber) > minBlockNumber) ?? []

  const numUncheckedDraws = Math.floor((maxTimestamp - minTimestamp) / seconds.day)

  if (!relevantFlashEvents.length && !relevantClaimedPrizeEvents.length && numUncheckedDraws < 1) return uncheckedPrizes

  const lastAwardedDrawId = await publicClient.readContract({
    address: prizePool.address,
    abi: prizePoolABI,
    functionName: 'getLastAwardedDrawId'
  })

  if (!lastAwardedDrawId) return uncheckedPrizes

  const prizeTokenPrice = await getTokenPrice(prizePool.prizeToken)
  const prizeTierInfo = await getPrizeTierInfo()

  if (!prizeTokenPrice || !Object.keys(prizeTierInfo).length) return uncheckedPrizes

  const lastTwabPeriodEndedAt = BigInt(Math.floor(maxTimestamp / seconds.hour))
  const lastTwabPeriodStartedAt = lastTwabPeriodEndedAt - BigInt(seconds.hour)

  const multicall = await publicClient.multicall({
    contracts: [
      {
        address: prizePool.address,
        abi: prizePoolABI,
        functionName: 'getVaultPortion',
        args: [prizeVault.address, lastAwardedDrawId, lastAwardedDrawId]
      },
      {
        address: prizePool.twabController.address,
        abi: twabControllerABI,
        functionName: 'getTotalSupplyTwabBetween',
        args: [prizeVault.address, lastTwabPeriodStartedAt, lastTwabPeriodEndedAt]
      },
      {
        address: prizePool.twabController.address,
        abi: twabControllerABI,
        functionName: 'getTwabBetween',
        args: [prizeVault.address, userAddress, lastTwabPeriodStartedAt, lastTwabPeriodEndedAt]
      }
    ]
  })

  const vaultPortion = parseFloat(
    formatEther(multicall[0].status === 'success' && typeof multicall[0].result === 'bigint' ? multicall[0].result : 0n)
  )
  const vaultTwab = parseFloat(
    formatUnits(
      multicall[1].status === 'success' && typeof multicall[1].result === 'bigint' ? multicall[1].result : 0n,
      prizeVault.decimals
    )
  )
  const userTwab = parseFloat(
    formatUnits(
      multicall[2].status === 'success' && typeof multicall[2].result === 'bigint' ? multicall[2].result : 0n,
      prizeVault.decimals
    )
  )

  const oddsMultiplier = (vaultPortion || 0.01) * (!!userTwab && !!vaultTwab ? userTwab / vaultTwab : 0.01)

  // Adding prizes won
  relevantFlashEvents.forEach((flashEvent) => {
    const size = parseFloat(formatUnits(BigInt(flashEvent.args.amount), prizeVault.decimals))
    const sizeInPrizeToken = size / prizeTokenPrice
    const nearestPrizeTier = Object.values(prizeTierInfo).reduce((a, b) =>
      Math.abs(b.size - sizeInPrizeToken) < Math.abs(a.size - sizeInPrizeToken) ? b : a
    )
    const userOdds = (nearestPrizeTier.size / sizeInPrizeToken) * nearestPrizeTier.odds * oddsMultiplier

    uncheckedPrizes.list.push({ size, count: 1, userOdds, userWon: 1 })
  })

  // Adding fallback prizes won
  relevantClaimedPrizeEvents.forEach((claimedPrizeEvent) => {
    const size = parseFloat(formatUnits(BigInt(claimedPrizeEvent.args.payout), prizeVault.decimals))
    const tierOdds = prizeTierInfo[claimedPrizeEvent.args.tier]?.odds ?? 1
    const userOdds = tierOdds * oddsMultiplier

    uncheckedPrizes.list.push({ size, count: 1, userOdds, userWon: 1 })
  })

  // Adding other estimated prizes awarded but not won
  Object.values(prizeTierInfo).forEach((tier) => {
    const size = tier.size * prizeTokenPrice
    const numDraws = numUncheckedDraws > 0 ? numUncheckedDraws : 1
    const count = tier.count * numDraws
    const userOdds = tier.odds * oddsMultiplier

    uncheckedPrizes.list.push({ size, count, userOdds, userWon: 0 })
  })

  return uncheckedPrizes
}

export const getPrizeTierInfo = async () => {
  const prizeTierInfo: { [prizeTier: number]: { size: number; count: number; odds: number } } = {}

  const publicClient = get(clients).public
  validateClientNetwork(publicClient)

  const numberOfTiers = await publicClient.readContract({ address: prizePool.address, abi: prizePoolABI, functionName: 'numberOfTiers' })

  const prizeTiers = [...Array(numberOfTiers - 2).keys()]

  const prizeSizeContracts: ContractFunctionParameters<typeof prizePoolABI, 'view', 'getTierPrizeSize'>[] = prizeTiers.map((prizeTier) => ({
    address: prizePool.address,
    abi: prizePoolABI,
    functionName: 'getTierPrizeSize',
    args: [prizeTier]
  }))
  const prizeOddsContracts: ContractFunctionParameters<typeof prizePoolABI, 'view', 'getTierOdds'>[] = prizeTiers.map((prizeTier) => ({
    address: prizePool.address,
    abi: prizePoolABI,
    functionName: 'getTierOdds',
    args: [prizeTier, numberOfTiers]
  }))

  // @ts-ignore
  const multicall = await publicClient.multicall({ contracts: [...prizeSizeContracts, ...prizeOddsContracts] })

  prizeTiers.forEach((prizeTier, i) => {
    const sizeCall = multicall[i]
    const userOddsCall = multicall[i + prizeTiers.length]

    const size = sizeCall.status === 'success' && typeof sizeCall.result === 'bigint' ? sizeCall.result : undefined
    const odds = userOddsCall.status === 'success' && typeof userOddsCall.result === 'bigint' ? userOddsCall.result : undefined

    if (!!size && !!odds) {
      prizeTierInfo[prizeTier] = {
        size: parseFloat(formatUnits(size, prizePool.prizeToken.decimals)),
        count: 4 ** prizeTier,
        odds: parseFloat(formatEther(odds))
      }
    }
  })

  return prizeTierInfo
}
