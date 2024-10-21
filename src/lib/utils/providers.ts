import { createPublicClient, createWalletClient, custom, type Address, type PublicClient, type WalletClient } from 'viem'
import { clients, getInitialClients, lastConnectedProviderId, userAddress, walletProviders } from '$lib/stores'
import { chain, publicClientSettings, transportSettings } from '$lib/config'
import { get } from 'svelte/store'
import { DSKit } from 'dskit-eth'
import type { EIP6963AnnounceProviderEvent, EIP6963ProviderData } from '$lib/types'
import SafeAppsSDK from '@safe-global/safe-apps-sdk'
import { SafeAppProvider } from '@safe-global/safe-apps-provider'

export const getWalletProviders = (options?: { onAutoConnect?: () => void }) => {
  const prevProviderId = get(lastConnectedProviderId)

  const safeSdk = new SafeAppsSDK()
  safeSdk.safe
    .getInfo()
    .then((safeInfo) => {
      if (safeInfo && safeInfo.chainId == chain.id) {
        const safeProvider = new SafeAppProvider(safeInfo, safeSdk)
        if (!get(userAddress)) {
          connect({
            info: {
              uuid: 'Safe',
              name: 'Safe App Connection',
              icon: '',
              rdns: ''
            },
            provider: safeProvider
          })
        }
      }
    })
    .catch(console.warn)

  const updateProviders = (providerData: EIP6963ProviderData) => {
    walletProviders.update((providers) => [...providers, providerData])

    if (!!prevProviderId && prevProviderId === providerData.info.uuid) {
      connect(providerData, { onConnected: options?.onAutoConnect })
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

export const connect = async (providerData: EIP6963ProviderData, options?: { onConnected?: (address: Address) => void }) => {
  const transport = custom(providerData.provider, transportSettings)

  const _walletClient = createWalletClient({ chain, transport })

  // Some providers only support `getAddresses` since `requestAddresses` uses optional RPC calls
  let [address] = await _walletClient.getAddresses()
  if (!address) {
    address = (await _walletClient.requestAddresses())[0]
  }

  const publicClient = createPublicClient({ chain, transport, ...publicClientSettings }) as PublicClient
  const walletClient = createWalletClient({ account: address, chain, transport })
  const dskitClient = new DSKit({ viemPublicClient: publicClient })

  const walletClientChainId = await walletClient.getChainId()

  if (walletClientChainId !== chain.id) {
    await walletClient.switchChain({ id: chain.id })
  }

  clients.set({ public: publicClient, wallet: walletClient, dskit: dskitClient })
  userAddress.set(address)
  lastConnectedProviderId.set(providerData.info.uuid)

  options?.onConnected?.(address)

  providerData.provider.on('accountsChanged', (accounts: Address[]) => {
    if (get(lastConnectedProviderId) === providerData.info.uuid) {
      userAddress.set(accounts[0])
    }
  })

  return address
}

export const disconnect = async () => {
  userAddress.set(undefined)
  clients.set(getInitialClients())
}

export const validateClientNetwork = async (client: PublicClient | WalletClient) => {
  const clientChainId = await client.getChainId()

  if (!clientChainId) {
    throw new Error('Invalid Client')
  } else if (clientChainId !== chain.id) {
    throw new Error(`Invalid Client Network: ${clientChainId}`)
  }
}
