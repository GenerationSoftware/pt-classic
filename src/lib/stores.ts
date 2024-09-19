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
import { dolphinAddress, localStorageKeys, publicClient } from './constants'
import { chain, prizeVault, zapInTokenOptions } from './config'
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

export const userLastCheckedBlockNumber = writable<bigint | undefined>(undefined)
export const userUncheckedPrizes = writable<{ list: UncheckedPrize[]; queriedAtBlockNumber: bigint } | undefined>(undefined)

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
  userLastCheckedBlockNumber.set(undefined)
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

    const currentBlockNumber = await publicClient.getBlockNumber()

    const cachedTransferEvents: KeyedCache<TransferEvent[]> = JSON.parse(localStorage.getItem(localStorageKeys.transferEvents) ?? '{}')
    const updatedUserTransferEvents = await updateUserTransferEvents(address, cachedTransferEvents[lower(address)]?.[chain.id] ?? [])

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

    const cachedLastCheckedBlockNumber: KeyedCache<string> = JSON.parse(
      localStorage.getItem(localStorageKeys.lastCheckedBlockNumber) ?? '{}'
    )
    const lastCheckedBlockNumber = BigInt(cachedLastCheckedBlockNumber[lower(address)]?.[chain.id] ?? '0')
    userLastCheckedBlockNumber.set(lastCheckedBlockNumber)

    userUncheckedPrizes.set(
      await getUserUncheckedPrizes(
        address,
        lastCheckedBlockNumber,
        updatedUserTransferEvents,
        updatedUserFlashEvents,
        updatedUserClaimedPrizeEvents,
        { checkBlockNumber: currentBlockNumber }
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

userLastCheckedBlockNumber.subscribe((lastCheckedBlockNumber) => {
  const address = get(userAddress)

  if (!!lastCheckedBlockNumber && !!address) {
    const newStorage: KeyedCache<string> = JSON.parse(localStorage.getItem(localStorageKeys.lastCheckedBlockNumber) ?? '{}')
    if (newStorage[lower(address)] === undefined) newStorage[lower(address)] = {}
    newStorage[lower(address)][chain.id] = lastCheckedBlockNumber.toString()

    localStorage.setItem(localStorageKeys.lastCheckedBlockNumber, JSON.stringify(newStorage))
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
