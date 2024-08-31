import { prizeVault, zapInTokenOptions } from './config'
import { dolphinAddress } from './constants'
import { getTokenBalances } from './utils'
import { writable } from 'svelte/store'
import type { Address, WalletClient } from 'viem'

export const walletClient = writable<WalletClient | undefined>(undefined)
export const userAddress = writable<Address | undefined>(undefined)

walletClient.subscribe(async (client) => {
  userAddress.set(!!client ? (await client.getAddresses())[0] : undefined)
})

export const userBalances = writable<{ [tokenAddress: Lowercase<Address>]: bigint }>({})

userAddress.subscribe(async (address) => {
  if (!!address) {
    const tokenBalances = await getTokenBalances(address, [
      prizeVault.address,
      prizeVault.asset.address,
      dolphinAddress,
      ...zapInTokenOptions.map((t) => t.address)
    ])
    userBalances.set(tokenBalances)
  } else {
    userBalances.set({})
  }
})

export const tokenPrices = writable<{ [tokenAddress: Lowercase<Address>]: number }>({})
