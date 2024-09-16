import { base, type Chain } from 'viem/chains'
import type { SwapRouteConfig } from 'dskit-eth'
import type { Token } from './types'
import type { Address } from 'viem'

export const appName: string = 'PT Classic'

export const chain = base satisfies Chain

export const prizePool = {
  address: '0x45b2010d8A4f08b53c9fa7544C51dFd9733732cb',
  drawPeriodSeconds: 86_400,
  prizeToken: { address: '0x4200000000000000000000000000000000000006', decimals: 18, name: 'Wrapped Ether', symbol: 'WETH' }
} satisfies { address: Address; drawPeriodSeconds: number; prizeToken: Token }

export const prizeVault = {
  address: '0x7f5C2b379b88499aC2B997Db583f8079503f25b9',
  decimals: 6,
  name: 'Prize USDC',
  symbol: 'przUSDC',
  asset: { address: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913', decimals: 6, name: 'USD Coin', symbol: 'USDC' },
  deployedAtBlock: 14_508_078n
} satisfies Token & { asset: Token; deployedAtBlock: bigint }

export const prizeHookAddress: Lowercase<Address> = '0x24857c8da1a89d06f5e37dc42094969621385a50' // TODO: get actual hook address

export const twabRewardsAddress: Lowercase<Address> = '0x86f0923d20810441efc593eb0f2825c6bff2dc09'

export const twabRewardsTokenOptions: Token[] = [
  { address: '0xd652C5425aea2Afd5fb142e120FeCf79e18fafc3', decimals: 18, name: 'PoolTogether', symbol: 'POOL' }
]

export const zapInTokenOptions: Token[] = []

export const tokenSwapRouteConfigs: { [address: Lowercase<Address>]: SwapRouteConfig } = {
  '0xd652c5425aea2afd5fb142e120fecf79e18fafc3': {
    exchanges: { includeOnly: ['velodrome'], includeRoutesThroughTokens: ['0x368181499736d0c0CC614DBB145E2EC1AC86b8c6'] }
  }
}
