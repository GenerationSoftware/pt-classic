import {
  getPrizeDistribution,
  getPrizeHookStatus,
  getPromotionInfo,
  getTokenPrice,
  getUserClaimableRewards,
  getUserClaimedRewards,
  getUserUncheckedPrizes,
  lower,
  updateUserClaimedPrizeEvents,
  updateUserFlashEvents,
  updateUserTokenBalances,
  updateUserTransferEvents
} from './utils'
import { createPublicClient, http, type Address, type PublicClient, type WalletClient } from 'viem'
import { chain, prizePool, publicClientSettings, transportSettings } from './config'
import { localStorageKeys } from './constants'
import { get, writable } from 'svelte/store'
import { DSKit } from 'dskit-eth'
import type {
  ClaimableReward,
  ClaimedPrizeEvent,
  ClaimedReward,
  EIP6963ProviderData,
  FlashEvent,
  UserKeyedCache,
  PrizeDistribution,
  PrizeHookStatus,
  PromotionInfo,
  TokenPrices,
  TransferEvent,
  UncheckedPrize,
  KeyedCache
} from './types'

export const walletProviders = writable<EIP6963ProviderData[]>([])

export const lastConnectedProviderId = writable<string | null>(localStorage.getItem(localStorageKeys.lastConnectedProviderId))
lastConnectedProviderId.subscribe((id) => !!id && localStorage.setItem(localStorageKeys.lastConnectedProviderId, id))

const getInitialClients = () => {
  const initialPublicClient = createPublicClient({
    chain,
    transport: http(undefined, transportSettings),
    ...publicClientSettings
  }) as PublicClient
  return { public: initialPublicClient, dskit: new DSKit({ viemPublicClient: initialPublicClient }) }
}
export const clients = writable<{ public: PublicClient; dskit: DSKit; wallet?: WalletClient }>(getInitialClients())

export const userAddress = writable<Address | undefined>(undefined)

export const userBalances = writable<{ [tokenAddress: Lowercase<Address>]: bigint }>({})
export const userPrizeHookStatus = writable<PrizeHookStatus | undefined>(undefined)

export const userTransferEvents = writable<TransferEvent[] | undefined>(undefined)
export const userFlashEvents = writable<FlashEvent[] | undefined>(undefined)
export const userClaimedPrizeEvents = writable<ClaimedPrizeEvent[] | undefined>(undefined)

export const userClaimedRewards = writable<ClaimedReward[] | undefined>(undefined)
export const userClaimableRewards = writable<ClaimableReward[] | undefined>(undefined)

export const userLastCheckedBlockNumber = writable<bigint | undefined>(undefined)
export const userUncheckedPrizes = writable<{ list: UncheckedPrize[]; queriedAtBlockNumber: bigint } | undefined>(undefined)

export const blockTimestamps = writable<{ [blockNumber: number]: number }>(
  JSON.parse(localStorage.getItem(localStorageKeys.blockTimestamps) ?? '{}')[chain.id] ?? {}
)

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
    await updateUserTokenBalances(address)

    const prizeHookStatus = await getPrizeHookStatus(address)
    userPrizeHookStatus.set(prizeHookStatus)

    const currentBlockNumber = await get(clients).public.getBlockNumber()

    const cachedTransferEvents: UserKeyedCache<TransferEvent[]> = JSON.parse(localStorage.getItem(localStorageKeys.transferEvents) ?? '{}')
    await updateUserTransferEvents(address, cachedTransferEvents[lower(address)]?.[chain.id] ?? [])

    const swapperAddresses = !!prizeHookStatus.isSwapperSet
      ? [prizeHookStatus.swapperAddress, ...prizeHookStatus.pastSwapperAddresses]
      : prizeHookStatus.pastSwapperAddresses

    const cachedFlashEvents: UserKeyedCache<FlashEvent[]> = JSON.parse(localStorage.getItem(localStorageKeys.flashEvents) ?? '{}')
    await updateUserFlashEvents(address, swapperAddresses, cachedFlashEvents[lower(address)]?.[chain.id] ?? [])

    const cachedClaimedPrizeEvents: UserKeyedCache<ClaimedPrizeEvent[]> = JSON.parse(
      localStorage.getItem(localStorageKeys.claimedPrizeEvents) ?? '{}'
    )
    await updateUserClaimedPrizeEvents(address, cachedClaimedPrizeEvents[lower(address)]?.[chain.id] ?? [])

    const cachedLastCheckedBlockNumber: UserKeyedCache<string> = JSON.parse(
      localStorage.getItem(localStorageKeys.lastCheckedBlockNumber) ?? '{}'
    )
    const lastCheckedBlockNumber = BigInt(cachedLastCheckedBlockNumber[lower(address)]?.[chain.id] ?? '0')
    userLastCheckedBlockNumber.set(lastCheckedBlockNumber)

    userUncheckedPrizes.set(await getUserUncheckedPrizes(address, { checkBlockNumber: currentBlockNumber }))
  }
})

userTransferEvents.subscribe((transferEvents) => {
  const address = get(userAddress)

  if (!!transferEvents && !!address) {
    const newStorage: UserKeyedCache<TransferEvent[]> = JSON.parse(localStorage.getItem(localStorageKeys.transferEvents) ?? '{}')
    if (newStorage[lower(address)] === undefined) newStorage[lower(address)] = {}
    newStorage[lower(address)][chain.id] = transferEvents

    localStorage.setItem(localStorageKeys.transferEvents, JSON.stringify(newStorage))
  }
})

userFlashEvents.subscribe((flashEvents) => {
  const address = get(userAddress)

  if (!!flashEvents && !!address) {
    const newStorage: UserKeyedCache<FlashEvent[]> = JSON.parse(localStorage.getItem(localStorageKeys.flashEvents) ?? '{}')
    if (newStorage[lower(address)] === undefined) newStorage[lower(address)] = {}
    newStorage[lower(address)][chain.id] = flashEvents

    localStorage.setItem(localStorageKeys.flashEvents, JSON.stringify(newStorage))
  }
})

userClaimedPrizeEvents.subscribe((claimedPrizeEvents) => {
  const address = get(userAddress)

  if (!!claimedPrizeEvents && !!address) {
    const newStorage: UserKeyedCache<ClaimedPrizeEvent[]> = JSON.parse(localStorage.getItem(localStorageKeys.claimedPrizeEvents) ?? '{}')
    if (newStorage[lower(address)] === undefined) newStorage[lower(address)] = {}
    newStorage[lower(address)][chain.id] = claimedPrizeEvents

    localStorage.setItem(localStorageKeys.claimedPrizeEvents, JSON.stringify(newStorage))
  }
})

userLastCheckedBlockNumber.subscribe((lastCheckedBlockNumber) => {
  const address = get(userAddress)

  if (!!lastCheckedBlockNumber && !!address) {
    const newStorage: UserKeyedCache<string> = JSON.parse(localStorage.getItem(localStorageKeys.lastCheckedBlockNumber) ?? '{}')
    if (newStorage[lower(address)] === undefined) newStorage[lower(address)] = {}
    newStorage[lower(address)][chain.id] = lastCheckedBlockNumber.toString()

    localStorage.setItem(localStorageKeys.lastCheckedBlockNumber, JSON.stringify(newStorage))
  }
})

blockTimestamps.subscribe((timestamps) => {
  const newStorage: KeyedCache<{ [blockNumber: number]: number }> = JSON.parse(
    localStorage.getItem(localStorageKeys.blockTimestamps) ?? '{}'
  )
  if (newStorage[chain.id] === undefined) newStorage[chain.id] = {}
  newStorage[chain.id] = { ...newStorage[chain.id], ...timestamps }

  localStorage.setItem(localStorageKeys.blockTimestamps, JSON.stringify(newStorage))
})

export const tokenPrices = writable<TokenPrices>({})

export const prizeDistribution = writable<PrizeDistribution | undefined>(undefined)

export const promotionInfo = writable<PromotionInfo | undefined>(undefined)

clients.subscribe(async ({ wallet }) => {
  if (!!wallet) {
    await getTokenPrice(prizePool.prizeToken)

    await getPrizeDistribution()

    if (get(promotionInfo) === undefined) {
      promotionInfo.set(await getPromotionInfo())
    }
  }
})

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

userClaimedRewards.subscribe(async (rewards) => {
  const keyedTokens: { [tokenAddress: Lowercase<Address>]: number } = {}
  rewards?.forEach((reward) => (keyedTokens[lower(reward.token.address)] = reward.token.decimals))

  const tokens = Object.entries(keyedTokens).map(([address, decimals]) => ({ address, decimals })) as {
    address: Lowercase<Address>
    decimals: number
  }[]

  for (const token of tokens) {
    await getTokenPrice(token)
  }
})

userClaimableRewards.subscribe(async (rewards) => {
  const keyedTokens: { [tokenAddress: Lowercase<Address>]: number } = {}
  rewards?.forEach((reward) => (keyedTokens[lower(reward.token.address)] = reward.token.decimals))

  const tokens = Object.entries(keyedTokens).map(([address, decimals]) => ({ address, decimals })) as {
    address: Lowercase<Address>
    decimals: number
  }[]

  for (const token of tokens) {
    await getTokenPrice(token)
  }
})
