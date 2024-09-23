import type {
  formatClaimedPrizeEvent,
  formatFlashEvent,
  formatTransferEvent,
  getPrizeDistribution,
  getPrizeHookStatus,
  getPromotionInfo,
  getUserClaimableRewards,
  getUserClaimedRewards,
  VectorMath
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

export interface UserKeyedCache<ValueType> {
  [userAddress: Lowercase<Address>]: KeyedCache<ValueType>
}
export interface KeyedCache<ValueType> {
  [chainId: number]: ValueType
}

export interface UncheckedPrize {
  size: number
  count: number
  userOdds: number
  userWon: number
}

export interface PlinkoState {
  state: 'ready' | 'playing' | 'done' | 'paused'
  frame: number
  ms: number
  ball: {
    pos: VectorMath.Vector2
    rot: number
    rotVel: number
    vel: VectorMath.Vector2
    acc: VectorMath.Vector2
  }
  nextPrizeRow: number
  prizesWon: number
  prizesTotal: number
  animationTriggers: PlinkoAnimation[]
}
export interface PlinkoAnimation {
  startMs: number
  durationMs: number
  draw: (ctx: CanvasRenderingContext2D, t: number) => void
}

export interface EIP6963ProviderData {
  info: {
    uuid: string
    name: string
    icon: string
    rdns: string
  }
  provider: any
}

export interface EIP6963AnnounceProviderEvent extends CustomEvent<EIP6963ProviderData> {
  type: 'eip6963:announceProvider'
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

export type PlinkoPrizeRowTile = number | '^' | ' '
