import type {
  getFlashEvents,
  getPrizeDistribution,
  getPrizeHookStatus,
  getPromotionInfo,
  getTransferEvents,
  getUserClaimableRewards,
  getUserClaimedRewards
} from './utils'
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

export type PromotionInfo = Awaited<ReturnType<typeof getPromotionInfo>>
export type ClaimedReward = Awaited<ReturnType<typeof getUserClaimedRewards>>[number]
export type ClaimableReward = Awaited<ReturnType<typeof getUserClaimableRewards>>[number]

export type TimeUnit = 'day' | 'week' | 'month' | 'year'
