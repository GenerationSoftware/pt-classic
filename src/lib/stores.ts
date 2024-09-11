import { getFlashEvents, getPrizeHookStatus, getTokenBalances, getTransferEvents } from './utils'
import { prizeVault, zapInTokenOptions } from './config'
import { dolphinAddress } from './constants'
import { writable } from 'svelte/store'
import type { FlashEvent, PrizeDistribution, PrizeHookStatus, TransferEvent } from './types'
import type { Address, WalletClient } from 'viem'

export const walletClient = writable<WalletClient | undefined>(undefined)
export const userAddress = writable<Address | undefined>(undefined)

walletClient.subscribe(async (client) => {
  userAddress.set(!!client ? (await client.getAddresses())[0] : undefined)
})

export const userBalances = writable<{ [tokenAddress: Lowercase<Address>]: bigint }>({})
export const userPrizeHookStatus = writable<PrizeHookStatus | undefined>(undefined)

// TODO: cache these somehow (save results, only query past X block next load, etc.)
export const userTransferEvents = writable<TransferEvent[]>([])
export const userFlashEvents = writable<FlashEvent[]>([])

export const isFetchedUserTransferEvents = writable<boolean>(false)
export const isFetchedUserFlashEvents = writable<boolean>(false)

// TODO: cache this somehow (careful with potential future network overlaps)
export const blockTimestamps = writable<{ [blockNumber: number]: number }>({})

userAddress.subscribe(async (address) => {
  if (!!address) {
    userBalances.set(
      await getTokenBalances(address, [
        prizeVault.address,
        prizeVault.asset.address,
        dolphinAddress,
        ...zapInTokenOptions.map((t) => t.address)
      ])
    )

    userTransferEvents.set(await getTransferEvents(address, prizeVault.address))
    isFetchedUserTransferEvents.set(true)

    const prizeHookStatus = await getPrizeHookStatus(address)
    userPrizeHookStatus.set(prizeHookStatus)

    const swapperAddresses = !!prizeHookStatus.isSwapperSet
      ? [prizeHookStatus.swapperAddress, ...prizeHookStatus.pastSwapperAddresses]
      : prizeHookStatus.pastSwapperAddresses
    userFlashEvents.set(await getFlashEvents(address, swapperAddresses))
    isFetchedUserFlashEvents.set(true)
  } else {
    userBalances.set({})
    userTransferEvents.set([])
    isFetchedUserTransferEvents.set(false)
    userPrizeHookStatus.set(undefined)
    userFlashEvents.set([])
    isFetchedUserFlashEvents.set(false)
  }
})

export const tokenPrices = writable<{ [tokenAddress: Lowercase<Address>]: number }>({})

export const prizeDistribution = writable<PrizeDistribution | undefined>(undefined)
