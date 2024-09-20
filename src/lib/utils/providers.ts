import { createPublicClient, createWalletClient, custom, fallback, http, type PublicClient, type WalletClient } from 'viem'
import { clients, lastConnectedProviderId, userAddress, walletProviders } from '$lib/stores'
import { publicClientSettings, transportSettings } from '$lib/constants'
import { chain } from '$lib/config'
import { get } from 'svelte/store'
import { DSKit } from 'dskit-eth'
import type { EIP6963AnnounceProviderEvent, EIP6963ProviderData } from '$lib/types'

export const getWalletProviders = () => {
  const prevProviderId = get(lastConnectedProviderId)

  const updateProviders = (providerData: EIP6963ProviderData) => {
    walletProviders.update((providers) => [...providers, providerData])

    if (!!prevProviderId && prevProviderId === providerData.info.uuid) {
      connect(providerData)
    }
  }

  window.addEventListener('eip6963:announceProvider', (_event: Event) => {
    const event = _event as EIP6963AnnounceProviderEvent

    if (!!event.detail.provider && !!event.detail.info) {
      updateProviders(event.detail)
    }
  })

  window.dispatchEvent(new Event('eip6963:requestProvider'))

  setTimeout(() => {
    if (get(walletProviders).length === 0) {
      if ('ethereum' in window) {
        updateProviders({
          info: { uuid: 'Injected', name: 'Injected', icon: '', rdns: 'Injected' },
          provider: window.ethereum
        })
      }
    }
  }, 1_000)
}

export const connect = async (providerData: EIP6963ProviderData) => {
  const transport = custom(providerData.provider, transportSettings)

  const _walletClient = createWalletClient({ chain, transport })

  const [address] = await _walletClient.requestAddresses()

  const publicClient = createPublicClient({ chain, transport, ...publicClientSettings }) as PublicClient
  const walletClient = createWalletClient({ account: address, chain, transport })
  const dskitClient = new DSKit({ viemPublicClient: publicClient })

  clients.set({ public: publicClient, wallet: walletClient, dskit: dskitClient })
  userAddress.set(address)
  lastConnectedProviderId.set(providerData.info.uuid)

  return address
}

export const validateClientNetwork = async (client: PublicClient | WalletClient) => {
  const clientChainId = await client.getChainId()

  if (!clientChainId) {
    throw new Error('Invalid Client')
  } else if (clientChainId !== chain.id) {
    throw new Error(`Invalid Client Network: ${clientChainId}`)
  }
}
