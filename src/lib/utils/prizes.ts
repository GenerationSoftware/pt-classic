import { publicClient } from '$lib/constants'
import { prizePoolABI } from '$lib/abis'
import { prizePool } from '$lib/config'

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
