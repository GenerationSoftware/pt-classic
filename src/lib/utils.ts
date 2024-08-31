import { dolphinAddress, publicClient } from './constants'
import { erc20Abi, type Address } from 'viem'

export const lower = (address: Address) => {
  return address.toLowerCase() as Lowercase<Address>
}

export const getTokenBalances = async (owner: Address, tokenAddresses: Address[]) => {
  const balances: { [tokenAddress: Lowercase<Address>]: bigint } = {}

  const uniqueTokenAddresses = [...new Set<Lowercase<Address>>(tokenAddresses.filter((a) => a !== dolphinAddress).map(lower))]

  const multicallResults = await publicClient.multicall({
    contracts: tokenAddresses.map((tokenAddress) => ({
      address: tokenAddress,
      abi: erc20Abi,
      functionName: 'balanceOf',
      args: [owner]
    }))
  })

  uniqueTokenAddresses.forEach((address, i) => {
    if (multicallResults[i].status === 'success' && typeof multicallResults[i].result === 'bigint') {
      balances[address] = multicallResults[i].result
    }
  })

  if (tokenAddresses.includes(dolphinAddress)) {
    balances[dolphinAddress] = await publicClient.getBalance({ address: owner })
  }

  return balances
}
