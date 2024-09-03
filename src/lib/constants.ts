import { getDefaultConfig } from '@rainbow-me/rainbowkit'
import { QueryClient } from '@tanstack/react-query'
import { getPublicClient } from 'wagmi/actions'
import { appName, chain } from './config'
import { http } from 'wagmi'

export const wagmiConfig = getDefaultConfig({
  appName,
  projectId: 'test', // TODO: get wallet id
  chains: [chain]
})

export const queryClient = new QueryClient()

export const publicClient = getPublicClient(wagmiConfig, { chainId: chain.id })

export const dolphinAddress = '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee'
