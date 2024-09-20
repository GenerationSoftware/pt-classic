import { parseUnits, type Address } from 'viem'
import { base, type Chain } from 'viem/chains'
import type { SwapRouteConfig } from 'dskit-eth'
import type { Token } from './types'

export const appName: string = 'PT Classic'

export const chain = base satisfies Chain

export const prizePool = {
  address: '0x45b2010d8A4f08b53c9fa7544C51dFd9733732cb',
  prizeToken: { address: '0x4200000000000000000000000000000000000006', decimals: 18, symbol: 'WETH' },
  twabController: { address: '0x7e63601F7e28C758Feccf8CDF02F6598694f44C6' },
  drawPeriodSeconds: 86_400
} satisfies { address: Address; prizeToken: Token; twabController: { address: Address }; drawPeriodSeconds: number }

export const prizeVault = {
  address: '0xAF2B22B7155da01230D72289DCEcB7C41a5a4bD8',
  decimals: 6,
  symbol: 'cPrzUSDC',
  asset: { address: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913', decimals: 6, symbol: 'USDC' },
  deployedAtBlock: 19_862_159n
} satisfies Token & { asset: Token; deployedAtBlock: bigint }

export const prizeHook = {
  address: '0x253c1c4c8600425c4ef00773b5943cdc0dd216f2',
  minPrizeSize: parseUnits('1', prizeVault.decimals)
} satisfies { address: Lowercase<Address>; minPrizeSize: bigint }

export const twabRewardsAddress: Lowercase<Address> = '0x86f0923d20810441efc593eb0f2825c6bff2dc09'

export const twabRewardsTokenOptions: Token[] = [{ address: '0xd652C5425aea2Afd5fb142e120FeCf79e18fafc3', decimals: 18, symbol: 'POOL' }]

export const zapInTokenOptions: Token[] = []

export const tokenSwapRouteConfigs: { [address: Lowercase<Address>]: SwapRouteConfig } = {
  '0xd652c5425aea2afd5fb142e120fecf79e18fafc3': {
    exchanges: { includeOnly: ['velodrome'], includeRoutesThroughTokens: ['0x368181499736d0c0CC614DBB145E2EC1AC86b8c6'] }
  }
}

export const pageTransition = { duration: 100 } satisfies { duration: number }
