import type { getFlashEvents, getPrizeDistribution, getPrizeHookStatus, getTransferEvents } from './utils'
import type { Address } from 'viem'

export interface Token {
  address: Address
  decimals: number
  name: string
  symbol: string
}

export type PrizeHookStatus = Awaited<ReturnType<typeof getPrizeHookStatus>>

export type TransferEvent = Awaited<ReturnType<typeof getTransferEvents>>[number]
export type FlashEvent = Awaited<ReturnType<typeof getFlashEvents>>[number]

export type PrizeDistribution = Awaited<ReturnType<typeof getPrizeDistribution>>

export type TimeUnit = 'day' | 'week' | 'month' | 'year'
