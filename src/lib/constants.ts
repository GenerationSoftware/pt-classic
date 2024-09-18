import { getDefaultConfig } from '@rainbow-me/rainbowkit'
import { QueryClient } from '@tanstack/react-query'
import { getPublicClient } from 'wagmi/actions'
import { http, type PublicClient } from 'viem'
import { appName, chain } from './config'
import { DSKit } from 'dskit-eth'

// TODO: find a way to use public RPCs + connected wallet's RPCs
export const wagmiConfig = getDefaultConfig({
  appName,
  projectId: 'test', // TODO: get wallet id
  chains: [chain],
  batch: { multicall: { batchSize: 1_024 * 1_024 } }
})

export const queryClient = new QueryClient()

export const publicClient = getPublicClient(wagmiConfig, { chainId: chain.id })

export const dskit = new DSKit({ viemPublicClient: publicClient as PublicClient })

export const dolphinAddress = '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee'

export const seconds = { day: 86_400, week: 604_800, month: 2_628_000, year: 31_536_000 }

export enum localStorageKeys {
  transferEvents = 'transferEvents',
  flashEvents = 'flashEvents',
  claimedPrizeEvents = 'claimedPrizeEvents'
}
