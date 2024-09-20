import { createPublicClient, http, type ClientConfig, type PublicClient, type TransportConfig } from 'viem'
import { chain } from './config'

export const transportSettings: Omit<TransportConfig, 'name' | 'key' | 'request' | 'type'> = { retryCount: 3, retryDelay: 500 }
export const publicClientSettings: Omit<ClientConfig, 'chain' | 'transport'> = { batch: { multicall: { batchSize: 1_024 * 1_024 } } }

export const defaultPublicClient = createPublicClient({
  chain,
  transport: http(undefined, transportSettings),
  ...publicClientSettings
}) as PublicClient

export const dolphinAddress = '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee'

export const seconds = { hour: 3_600, day: 86_400, week: 604_800, month: 2_628_000, year: 31_536_000 }

export enum localStorageKeys {
  lastConnectedProviderId = 'lastConnectedProviderId',
  transferEvents = 'transferEvents',
  flashEvents = 'flashEvents',
  claimedPrizeEvents = 'claimedPrizeEvents',
  lastCheckedBlockNumber = 'lastCheckedBlockNumber'
}
