import {
  clients,
  prizeDistribution,
  userClaimedPrizeEvents,
  userFlashEvents,
  userLastCheckedBlockNumber,
  userTransferEvents
} from '$lib/stores'
import { prizeHook, prizePool, prizeVault } from '$lib/config'
import { formatEther, formatUnits, type Address } from 'viem'
import { prizePoolABI, twabControllerABI } from '$lib/abis'
import { validateClientNetwork } from './providers'
import { getBlockTimestamp } from './time'
import { getTokenPrice } from './tokens'
import { seconds } from '$lib/constants'
import { lower } from './formatting'
import { get } from 'svelte/store'
import type { PrizeDistribution, UncheckedPrize } from '$lib/types'

export const getPrizeDistribution = async () => {
  const existingPrizeDistribution = get(prizeDistribution)
  if (existingPrizeDistribution !== undefined) return existingPrizeDistribution

  const newPrizeDistribution: PrizeDistribution = []

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
      })),
      ...prizeTiers.map((tier) => ({
        address: prizePool.address,
        abi: prizePoolABI,
        functionName: 'getTierOdds',
        args: [tier, numberOfTiers]
      }))
    ]
  })

  if (multicall.every((entry) => entry.status === 'success' && (typeof entry.result === 'bigint' || typeof entry.result === 'number'))) {
    prizeTiers.forEach((tier, i) => {
      const size = parseFloat(formatUnits(multicall[i].result as bigint, prizePool.prizeToken.decimals))
      const accrualDuration = multicall[i + prizeTiers.length].result as number
      const odds = parseFloat(formatEther(multicall[i + prizeTiers.length * 2].result as bigint))

      const count = 4 ** i
      const drawFrequency = count / accrualDuration

      newPrizeDistribution.push({ tier, size, count, odds, drawFrequency })
    })

    prizeDistribution.set(newPrizeDistribution)
  }

  return newPrizeDistribution
}

export const getUserUncheckedPrizes = async (userAddress: Address, options?: { checkBlockNumber?: bigint }) => {
  const uncheckedPrizes: { list: UncheckedPrize[]; queriedAtBlockNumber: bigint } = { list: [], queriedAtBlockNumber: 0n }

  const publicClient = get(clients).public
  validateClientNetwork(publicClient)

  const firstDepositEvent = get(userTransferEvents)?.find(
    (e) => lower(e.args.to) === lower(userAddress) && lower(e.args.from) !== prizeHook.address
  )

  const minBlockNumber =
    get(userLastCheckedBlockNumber) || (!!firstDepositEvent ? BigInt(firstDepositEvent.blockNumber) : prizeVault.deployedAtBlock)
  const maxBlockNumber = options?.checkBlockNumber ?? (await publicClient.getBlockNumber())

  uncheckedPrizes.queriedAtBlockNumber = maxBlockNumber

  if (minBlockNumber >= maxBlockNumber) return uncheckedPrizes

  const minTimestamp = await getBlockTimestamp(minBlockNumber)
  const maxTimestamp = await getBlockTimestamp(maxBlockNumber, { cache: false })

  if (minTimestamp >= maxTimestamp) return uncheckedPrizes

  const relevantFlashEvents = get(userFlashEvents)?.filter((e) => BigInt(e.blockNumber) > minBlockNumber) ?? []
  const relevantClaimedPrizeEvents = get(userClaimedPrizeEvents)?.filter((e) => BigInt(e.blockNumber) > minBlockNumber) ?? []

  const numUncheckedDraws = Math.floor((maxTimestamp - minTimestamp) / seconds.day)

  if (!relevantFlashEvents.length && !relevantClaimedPrizeEvents.length && (!firstDepositEvent || numUncheckedDraws < 1))
    return uncheckedPrizes

  const lastAwardedDrawId = await publicClient.readContract({
    address: prizePool.address,
    abi: prizePoolABI,
    functionName: 'getLastAwardedDrawId'
  })

  if (!lastAwardedDrawId) return uncheckedPrizes

  const prizeTokenPrice = await getTokenPrice(prizePool.prizeToken)
  const prizeDistribution = await getPrizeDistribution()

  if (!prizeTokenPrice || !prizeDistribution.length) return uncheckedPrizes

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
    const nearestPrizeTier = prizeDistribution.reduce((a, b) =>
      Math.abs(b.size - sizeInPrizeToken) < Math.abs(a.size - sizeInPrizeToken) ? b : a
    )
    const userOdds = (nearestPrizeTier.size / sizeInPrizeToken) * nearestPrizeTier.odds * oddsMultiplier

    uncheckedPrizes.list.push({ size, count: 1, userOdds, userWon: 1 })
  })

  // Adding fallback prizes won
  relevantClaimedPrizeEvents.forEach((claimedPrizeEvent) => {
    const size = parseFloat(formatUnits(BigInt(claimedPrizeEvent.args.payout), prizeVault.decimals))
    const tierOdds = prizeDistribution[claimedPrizeEvent.args.tier]?.odds ?? 1
    const userOdds = tierOdds * oddsMultiplier

    uncheckedPrizes.list.push({ size, count: 1, userOdds, userWon: 1 })
  })

  // Adding other estimated prizes awarded but not won
  prizeDistribution.forEach((tier) => {
    const size = tier.size * prizeTokenPrice
    const numDraws = numUncheckedDraws > 0 ? numUncheckedDraws : 1
    const count = tier.count * numDraws
    const userOdds = tier.odds * oddsMultiplier

    uncheckedPrizes.list.push({ size, count, userOdds, userWon: 0 })
  })

  return uncheckedPrizes
}

export const getTotalPrizeValueAvailable = (prizeDistribution: PrizeDistribution, prizeTokenPrice: number) => {
  const utilizationRateMultiplier = 1 / prizePool.tierLiquidityUtilizationRate

  const totalPrizeAmount = prizeDistribution.reduce((a, { size, count }) => a + size * utilizationRateMultiplier * count, 0)

  return totalPrizeAmount * prizeTokenPrice
}
