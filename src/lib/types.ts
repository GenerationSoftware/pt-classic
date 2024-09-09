import type { getFlashEvents, getPrizeHookStatus, getTransferEvents } from './utils'
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
