import { formatEther, formatUnits, type Address, type ContractFunctionParameters } from 'viem'
import { prizePoolABI, twabControllerABI } from '$lib/abis'
import { publicClient, seconds } from '$lib/constants'
import { prizePool, prizeVault } from '$lib/config'
import { getCurrentTimestamp } from './time'
import type { ClaimedPrizeEvent, FlashEvent, UncheckedPrize } from '$lib/types'

export const getPrizeDistribution = async () => {
  const prizeDistribution: { tier: number; size: bigint; drawFrequency: number }[] = []

  const numberOfTiers = await publicClient.readContract({ address: prizePool.address, abi: prizePoolABI, functionName: 'numberOfTiers' })
  const prizeTiers = Array.from(Array(numberOfTiers).keys())

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
      const accrualDuration = multicall[i + numberOfTiers].result as number

      const prizeCount = 4 ** i
      const drawFrequency = prizeCount / accrualDuration

      prizeDistribution.push({ tier, size, drawFrequency })
    })
  }

  return prizeDistribution
}

export const getUserUncheckedPrizes = async (
  userAddress: Address,
  lastDrawChecked: number,
  flashEvents: FlashEvent[],
  claimedPrizeEvents: ClaimedPrizeEvent[],
  lastCheckedPrizeBlockNumber: bigint
) => {
  const uncheckedPrizes: UncheckedPrize[] = []

  const relevantFlashEvents = flashEvents.filter((e) => BigInt(e.blockNumber) > lastCheckedPrizeBlockNumber)
  const relevantClaimedPrizeEvents = claimedPrizeEvents.filter((e) => BigInt(e.blockNumber) > lastCheckedPrizeBlockNumber)

  const lastAwardedDraw = await publicClient.readContract({
    address: prizePool.address,
    abi: prizePoolABI,
    functionName: 'getLastAwardedDrawId'
  })

  // TODO: what if user wasn't deposited before draw X? should not count as unchecked (maybe use blocknumber of first deposit instead?)
  const numUncheckedDraws = lastAwardedDraw - lastDrawChecked

  if (!!relevantFlashEvents.length || !!relevantClaimedPrizeEvents.length || numUncheckedDraws > 0) {
    const firstDraw = prizePool.grandPrizePeriodDraws >= lastAwardedDraw ? 1 : lastAwardedDraw - prizePool.grandPrizePeriodDraws + 1

    const firstDrawClosesAt = await publicClient.readContract({
      address: prizePool.address,
      abi: prizePoolABI,
      functionName: 'drawClosesAt',
      args: [firstDraw]
    })

    const lastTwabPeriodEndedAt = BigInt(Math.floor(getCurrentTimestamp() / seconds.hour))
    let firstDrawFinalizesAt = BigInt(firstDrawClosesAt + prizePool.drawPeriodSeconds)

    while (firstDrawFinalizesAt > lastTwabPeriodEndedAt) {
      firstDrawFinalizesAt -= BigInt(seconds.hour)
    }

    const twabMulticall = await publicClient.multicall({
      contracts: [
        {
          address: prizePool.address,
          abi: prizePoolABI,
          functionName: 'getVaultPortion',
          args: [prizeVault.address, firstDraw, lastAwardedDraw]
        },
        {
          address: prizePool.twabController.address,
          abi: twabControllerABI,
          functionName: 'getTotalSupplyTwabBetween',
          args: [prizeVault.address, firstDrawFinalizesAt, lastTwabPeriodEndedAt]
        },
        {
          address: prizePool.twabController.address,
          abi: twabControllerABI,
          functionName: 'getTwabBetween',
          args: [prizeVault.address, userAddress, firstDrawFinalizesAt, lastTwabPeriodEndedAt]
        }
      ]
    })

    if (twabMulticall.every((call) => call.status === 'success' && typeof call.result === 'bigint')) {
      const vaultPortion = parseFloat(formatEther(twabMulticall[0].result!))
      const vaultSupply = parseFloat(formatEther(twabMulticall[1].result!))
      const userSupply = parseFloat(formatEther(twabMulticall[2].result!))

      const userPortion = vaultPortion * (userSupply / vaultSupply)

      if (!!userPortion) {
        const prizeTierInfo = await getPrizeTierInfo()

        const prizeTiers = Object.keys(prizeTierInfo).map(Number)

        prizeTiers.forEach((prizeTier) => {
          const { size, count, odds } = prizeTierInfo[prizeTier]

          const numDraws = numUncheckedDraws > 0 ? numUncheckedDraws : 1
          const aggregateCount = count * numDraws

          // TODO: double check that `aggregateCount` can be used for `userOdds` here without breaking plinko
          uncheckedPrizes.push({ size, count: aggregateCount, userOdds: odds * aggregateCount * userPortion, userWon: 0 })
        })

        const userPrizesWon: UncheckedPrize[] = relevantFlashEvents.map((e) => ({
          size: parseFloat(formatUnits(BigInt(e.args.amount), prizeVault.decimals)),
          count: 1,
          userOdds: 0.1, // TODO: discuss this value - it essentially determines the minimum number of rows in plinko (1/x) - maybe x is smaller as size grows?
          userWon: 1
        }))

        const userFallbackPrizesWon: UncheckedPrize[] = relevantClaimedPrizeEvents.map((e) => ({
          size: parseFloat(formatUnits(BigInt(e.args.payout), prizeVault.decimals)),
          count: 1,
          userOdds: 0.1, // TODO: emulate logic from above
          userWon: 1
        }))

        userPrizesWon.forEach((prize) => uncheckedPrizes.push(prize))
        userFallbackPrizesWon.forEach((prize) => uncheckedPrizes.push(prize))
      }
    }
  }

  return uncheckedPrizes
}

export const getPrizeTierInfo = async () => {
  const prizeTierInfo: { [prizeTier: number]: { size: number; count: number; odds: number } } = {}

  const numberOfTiers = await publicClient.readContract({
    address: prizePool.address,
    abi: prizePoolABI,
    functionName: 'numberOfTiers'
  })

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
        count: prizeTier ** 4,
        odds: parseFloat(formatEther(odds))
      }
    }
  })

  return prizeTierInfo
}
