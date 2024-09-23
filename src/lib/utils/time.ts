import { blockTimestamps, clients } from '$lib/stores'
import { validateClientNetwork } from './providers'
import { get } from 'svelte/store'

export const getBlockTimestamp = async (blockNumber: bigint, options?: { cache?: boolean }) => {
  const existingBlockTimestamp = get(blockTimestamps)[Number(blockNumber)]
  if (!!existingBlockTimestamp) return existingBlockTimestamp

  const publicClient = get(clients).public
  validateClientNetwork(publicClient)

  const block = await publicClient.getBlock({ blockNumber, includeTransactions: false })

  if (options?.cache !== false) {
    blockTimestamps.update((oldBlockTimestamps) => ({ ...oldBlockTimestamps, [Number(blockNumber)]: Number(block.timestamp) }))
  }

  return Number(block.timestamp)
}

export const getBlockDate = async (blockNumber: bigint) => {
  return new Date((await getBlockTimestamp(blockNumber)) * 1e3).toLocaleDateString('en', { day: '2-digit', month: '2-digit' })
}

export const getCurrentTimestamp = () => {
  return Number((Date.now() / 1_000).toFixed(0))
}
