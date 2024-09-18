import type {
  formatClaimedPrizeEvent,
  formatFlashEvent,
  formatTransferEvent,
  getPrizeDistribution,
  getPrizeHookStatus,
  getPromotionInfo,
  getUserClaimableRewards,
  getUserClaimedRewards
} from './utils'
import type { Address } from 'viem'

export interface Token {
  address: Address
  decimals: number
  symbol: string
}

export interface TokenPrices {
  [tokenAddress: Lowercase<Address>]: number
}

export type PrizeHookStatus = Awaited<ReturnType<typeof getPrizeHookStatus>>

export type TransferEvent = ReturnType<typeof formatTransferEvent>
export type FlashEvent = ReturnType<typeof formatFlashEvent>
export type ClaimedPrizeEvent = ReturnType<typeof formatClaimedPrizeEvent>

export type PrizeDistribution = Awaited<ReturnType<typeof getPrizeDistribution>>

export type PromotionInfo = Awaited<ReturnType<typeof getPromotionInfo>>
export type ClaimedReward = Awaited<ReturnType<typeof getUserClaimedRewards>>[number]
export type ClaimableReward = Awaited<ReturnType<typeof getUserClaimableRewards>>[number]

export type TimeUnit = 'day' | 'week' | 'month' | 'year'

export interface EventCache<EventType> {
  [userAddress: Lowercase<Address>]: { [chainId: number]: EventType[] }
}
