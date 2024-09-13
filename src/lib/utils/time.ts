import { blockTimestamps } from '$lib/stores'
import { publicClient } from '$lib/constants'
import { get } from 'svelte/store'

export const getBlockTimestamp = async (blockNumber: bigint) => {
  const existingBlockTimestamp = get(blockTimestamps)[Number(blockNumber)]
  if (!!existingBlockTimestamp) return existingBlockTimestamp

  const block = await publicClient.getBlock({ blockNumber, includeTransactions: false })

  blockTimestamps.update((oldBlockTimestamps) => ({ ...oldBlockTimestamps, [Number(blockNumber)]: Number(block.timestamp) }))

  return Number(block.timestamp)
}

export const getCurrentTimestamp = () => {
  return Number((Date.now() / 1_000).toFixed(0))
}
