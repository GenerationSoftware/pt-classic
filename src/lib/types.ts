import type { Address } from 'viem'

export interface Token {
  address: Address
  decimals: number
  name: string
  symbol: string
}
