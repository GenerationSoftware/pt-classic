import { base, type Chain } from 'viem/chains'
import type { Token } from './types'
import type { Address } from 'viem'

export const appName: string = 'PT Classic'

export const chain = base satisfies Chain

export const prizePool = {
  address: '0x45b2010d8A4f08b53c9fa7544C51dFd9733732cb',
  prizeToken: { address: '0x4200000000000000000000000000000000000006', decimals: 18, name: 'Wrapped Ether', symbol: 'WETH' }
} satisfies { address: Address; prizeToken: Token }

export const prizeVault = {
  address: '0x7f5C2b379b88499aC2B997Db583f8079503f25b9',
  decimals: 6,
  name: 'Prize USDC',
  symbol: 'przUSDC',
  asset: { address: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913', decimals: 6, name: 'USD Coin', symbol: 'USDC' }
} satisfies Token & { asset: Token }

export const zapInTokenOptions: Token[] = []
