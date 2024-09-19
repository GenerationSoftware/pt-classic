import {
  getPrizeHookStatus,
  getTokenBalances,
  getUserClaimableRewards,
  getUserClaimedRewards,
  getUserUncheckedPrizes,
  lower,
  updateUserClaimedPrizeEvents,
  updateUserFlashEvents,
  updateUserTransferEvents
} from './utils'
import { chain, prizeVault, zapInTokenOptions } from './config'
import { dolphinAddress, localStorageKeys } from './constants'
import { get, writable } from 'svelte/store'
import type {
  ClaimableReward,
  ClaimedPrizeEvent,
  ClaimedReward,
  FlashEvent,
  KeyedCache,
  PrizeDistribution,
  PrizeHookStatus,
  PromotionInfo,
  TokenPrices,
  TransferEvent,
  UncheckedPrize
} from './types'
import type { Address, WalletClient } from 'viem'

export const walletClient = writable<WalletClient | undefined>(undefined)
export const userAddress = writable<Address | undefined>(undefined)

walletClient.subscribe(async (client) => {
  userAddress.set(!!client ? (await client.getAddresses())[0] : undefined)
})

export const userBalances = writable<{ [tokenAddress: Lowercase<Address>]: bigint }>({})
export const userPrizeHookStatus = writable<PrizeHookStatus | undefined>(undefined)

export const userTransferEvents = writable<TransferEvent[] | undefined>(undefined)
export const userFlashEvents = writable<FlashEvent[] | undefined>(undefined)
export const userClaimedPrizeEvents = writable<ClaimedPrizeEvent[] | undefined>(undefined)

export const userClaimedRewards = writable<ClaimedReward[] | undefined>(undefined)
export const userClaimableRewards = writable<ClaimableReward[] | undefined>(undefined)

export const userLastDrawChecked = writable<number | undefined>(undefined)
export const userLastCheckedPrizeBlockNumber = writable<bigint | undefined>(undefined)
export const userUncheckedPrizes = writable<UncheckedPrize[] | undefined>(undefined)

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
  userLastDrawChecked.set(undefined)
  userLastCheckedPrizeBlockNumber.set(undefined)
  userUncheckedPrizes.set(undefined)

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

    const cachedTransferEvents: KeyedCache<TransferEvent[]> = JSON.parse(localStorage.getItem(localStorageKeys.transferEvents) ?? '{}')
    await updateUserTransferEvents(address, cachedTransferEvents[lower(address)]?.[chain.id] ?? [])

    const swapperAddresses = !!prizeHookStatus.isSwapperSet
      ? [prizeHookStatus.swapperAddress, ...prizeHookStatus.pastSwapperAddresses]
      : prizeHookStatus.pastSwapperAddresses

    const cachedFlashEvents: KeyedCache<FlashEvent[]> = JSON.parse(localStorage.getItem(localStorageKeys.flashEvents) ?? '{}')
    const updatedUserFlashEvents = await updateUserFlashEvents(
      address,
      swapperAddresses,
      cachedFlashEvents[lower(address)]?.[chain.id] ?? []
    )

    const cachedClaimedPrizeEvents: KeyedCache<ClaimedPrizeEvent[]> = JSON.parse(
      localStorage.getItem(localStorageKeys.claimedPrizeEvents) ?? '{}'
    )
    const updatedUserClaimedPrizeEvents = await updateUserClaimedPrizeEvents(
      address,
      cachedClaimedPrizeEvents[lower(address)]?.[chain.id] ?? []
    )

    const cachedLastDrawChecked: KeyedCache<number> = JSON.parse(localStorage.getItem(localStorageKeys.lastDrawChecked) ?? '{}')
    const lastDrawChecked = cachedLastDrawChecked[lower(address)]?.[chain.id] ?? 0
    userLastDrawChecked.set(lastDrawChecked)

    const cachedLastCheckedPrizeBlockNumber: KeyedCache<string> = JSON.parse(
      localStorage.getItem(localStorageKeys.lastCheckedPrizeBlockNumber) ?? '{}'
    )
    const lastCheckedPrizeBlockNumber = BigInt(cachedLastCheckedPrizeBlockNumber[lower(address)]?.[chain.id] ?? '0')
    userLastCheckedPrizeBlockNumber.set(lastCheckedPrizeBlockNumber)

    userUncheckedPrizes.set(
      await getUserUncheckedPrizes(
        address,
        lastDrawChecked,
        updatedUserFlashEvents,
        updatedUserClaimedPrizeEvents,
        lastCheckedPrizeBlockNumber
      )
    )
  }
})

userTransferEvents.subscribe((transferEvents) => {
  const address = get(userAddress)

  if (!!transferEvents && !!address) {
    const newStorage: KeyedCache<TransferEvent[]> = JSON.parse(localStorage.getItem(localStorageKeys.transferEvents) ?? '{}')
    if (newStorage[lower(address)] === undefined) newStorage[lower(address)] = {}
    newStorage[lower(address)][chain.id] = transferEvents

    localStorage.setItem(localStorageKeys.transferEvents, JSON.stringify(newStorage))
  }
})

userFlashEvents.subscribe((flashEvents) => {
  const address = get(userAddress)

  if (!!flashEvents && !!address) {
    const newStorage: KeyedCache<FlashEvent[]> = JSON.parse(localStorage.getItem(localStorageKeys.flashEvents) ?? '{}')
    if (newStorage[lower(address)] === undefined) newStorage[lower(address)] = {}
    newStorage[lower(address)][chain.id] = flashEvents

    localStorage.setItem(localStorageKeys.flashEvents, JSON.stringify(newStorage))
  }
})

userClaimedPrizeEvents.subscribe((claimedPrizeEvents) => {
  const address = get(userAddress)

  if (!!claimedPrizeEvents && !!address) {
    const newStorage: KeyedCache<ClaimedPrizeEvent[]> = JSON.parse(localStorage.getItem(localStorageKeys.claimedPrizeEvents) ?? '{}')
    if (newStorage[lower(address)] === undefined) newStorage[lower(address)] = {}
    newStorage[lower(address)][chain.id] = claimedPrizeEvents

    localStorage.setItem(localStorageKeys.claimedPrizeEvents, JSON.stringify(newStorage))
  }
})

userLastDrawChecked.subscribe((lastDrawChecked) => {
  const address = get(userAddress)

  if (!!lastDrawChecked && !!address) {
    const newStorage: KeyedCache<number> = JSON.parse(localStorage.getItem(localStorageKeys.lastDrawChecked) ?? '{}')
    if (newStorage[lower(address)] === undefined) newStorage[lower(address)] = {}
    newStorage[lower(address)][chain.id] = lastDrawChecked

    localStorage.setItem(localStorageKeys.lastDrawChecked, JSON.stringify(newStorage))
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
