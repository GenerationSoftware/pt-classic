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

export const getBlockDate = async (blockNumber: bigint) => {
  return new Date((await getBlockTimestamp(blockNumber)) * 1e3).toLocaleDateString('en', { day: '2-digit', month: '2-digit' })
}

export const getCurrentTimestamp = () => {
  return Number((Date.now() / 1_000).toFixed(0))
}
