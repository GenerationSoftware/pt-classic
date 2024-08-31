import { createConfig, getPublicClient, http } from '@wagmi/core'
import { chain } from './config'

export const wagmiConfig = createConfig({
  chains: [chain],
  transports: { [chain.id]: http() }
})

export const publicClient = getPublicClient(wagmiConfig, { chainId: chain.id })

export const dolphinAddress = '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee'
