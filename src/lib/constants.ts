import { getDefaultConfig } from '@rainbow-me/rainbowkit'
import { QueryClient } from '@tanstack/react-query'
import { getPublicClient } from 'wagmi/actions'
import { appName, chain } from './config'

// TODO: find a way to use public RPCs + connected wallet's RPCs
export const wagmiConfig = getDefaultConfig({
  appName,
  projectId: 'test', // TODO: get wallet id
  chains: [chain]
})

export const queryClient = new QueryClient()

export const publicClient = getPublicClient(wagmiConfig, { chainId: chain.id })

export const dolphinAddress = '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee'

export const seconds = { day: 86_400, week: 604_800, month: 2_628_000, year: 31_536_000 }
