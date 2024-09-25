import { createPublicClient, http, type Address } from 'viem'
import { mainnet } from 'viem/chains'
import { normalize } from 'viem/ens'

const mainnetPublicClient = createPublicClient({ chain: mainnet, transport: http() })

export const getEnsName = async (address: Address) => {
  return await mainnetPublicClient.getEnsName({ address })
}

export const getEnsAvatar = async (ens: string) => {
  return await mainnetPublicClient.getEnsAvatar({ name: normalize(ens) })
}
