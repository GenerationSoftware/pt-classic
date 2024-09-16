import {
  getClaimedPrizeEvents,
  getFlashEvents,
  getPrizeHookStatus,
  getTokenBalances,
  getTransferEvents,
  getUserClaimableRewards,
  getUserClaimedRewards
} from './utils'
import { prizeVault, zapInTokenOptions } from './config'
import { dolphinAddress } from './constants'
import { get, writable } from 'svelte/store'
import type {
  ClaimableReward,
  ClaimedPrizeEvent,
  ClaimedReward,
  FlashEvent,
  PrizeDistribution,
  PrizeHookStatus,
  PromotionInfo,
  TokenPrices,
  TransferEvent
} from './types'
import type { Address, WalletClient } from 'viem'

export const walletClient = writable<WalletClient | undefined>(undefined)
export const userAddress = writable<Address | undefined>(undefined)

walletClient.subscribe(async (client) => {
  userAddress.set(!!client ? (await client.getAddresses())[0] : undefined)
})

export const userBalances = writable<{ [tokenAddress: Lowercase<Address>]: bigint }>({})
export const userPrizeHookStatus = writable<PrizeHookStatus | undefined>(undefined)

// TODO: cache these somehow (save results, only query past X block next load, etc.)
export const userTransferEvents = writable<TransferEvent[] | undefined>(undefined)
export const userFlashEvents = writable<FlashEvent[] | undefined>(undefined)
export const userClaimedPrizeEvents = writable<ClaimedPrizeEvent[] | undefined>(undefined)

export const userClaimedRewards = writable<ClaimedReward[] | undefined>(undefined)
export const userClaimableRewards = writable<ClaimableReward[] | undefined>(undefined)

// TODO: cache this somehow (careful with potential future network overlaps)
export const blockTimestamps = writable<{ [blockNumber: number]: number }>({})

userAddress.subscribe(async (address) => {
  userBalances.set({})
  userPrizeHookStatus.set(undefined)
  userTransferEvents.set(undefined)
  userFlashEvents.set(undefined)
  userClaimedPrizeEvents.set(undefined)
  userClaimedRewards.set(undefined)
  userClaimableRewards.set(undefined)

  if (!!address) {
    userBalances.set(
      await getTokenBalances(address, [
        prizeVault.address,
        prizeVault.asset.address,
        dolphinAddress,
        ...zapInTokenOptions.map((t) => t.address)
      ])
    )

    const prizeHookStatus = await getPrizeHookStatus(address)
    userPrizeHookStatus.set(prizeHookStatus)

    userTransferEvents.set(await getTransferEvents(address, prizeVault.address))

    const swapperAddresses = !!prizeHookStatus.isSwapperSet
      ? [prizeHookStatus.swapperAddress, ...prizeHookStatus.pastSwapperAddresses]
      : prizeHookStatus.pastSwapperAddresses

    userFlashEvents.set(await getFlashEvents(address, swapperAddresses))

    userClaimedPrizeEvents.set(await getClaimedPrizeEvents(address))
  }
})

export const tokenPrices = writable<TokenPrices>({})

export const prizeDistribution = writable<PrizeDistribution | undefined>(undefined)

export const promotionInfo = writable<PromotionInfo | undefined>(undefined)

promotionInfo.subscribe(async (info) => {
  const address = get(userAddress)

  if (!!info && !!address) {
    userClaimedRewards.set(await getUserClaimedRewards(info, address))
    userClaimableRewards.set(await getUserClaimableRewards(info, address))
  }
})

userAddress.subscribe(async (address) => {
  const info = get(promotionInfo)

  if (!!address && !!info) {
    userClaimedRewards.set(await getUserClaimedRewards(info, address))
    userClaimableRewards.set(await getUserClaimableRewards(info, address))
  }
})
