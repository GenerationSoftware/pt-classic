import { prizeHookAddress, prizeVault } from '$lib/config'
import { publicClient } from '$lib/constants'
import type { Address } from 'viem'

export const getTransferEvents = async (
  address: Address,
  tokenAddress: Address,
  options?: { filter?: 'from' | 'to'; fromBlock?: bigint }
) => {
  const fromTransferEvents =
    options?.filter === 'to'
      ? []
      : await publicClient.getLogs({
          address: tokenAddress,
          event: {
            type: 'event',
            name: 'Transfer',
            inputs: [
              { indexed: true, name: 'from', type: 'address' },
              { indexed: true, name: 'to', type: 'address' },
              { indexed: false, name: 'value', type: 'uint256' }
            ]
          },
          args: { from: address },
          fromBlock: options?.fromBlock ?? prizeVault.deployedAtBlock,
          toBlock: 'latest',
          strict: true
        })

  const toTransferEvents =
    options?.filter === 'from'
      ? []
      : await publicClient.getLogs({
          address: tokenAddress,
          event: {
            type: 'event',
            name: 'Transfer',
            inputs: [
              { indexed: true, name: 'from', type: 'address' },
              { indexed: true, name: 'to', type: 'address' },
              { indexed: false, name: 'value', type: 'uint256' }
            ]
          },
          args: { to: address },
          fromBlock: options?.fromBlock ?? prizeVault.deployedAtBlock,
          toBlock: 'latest',
          strict: true
        })

  return [...fromTransferEvents, ...toTransferEvents]
}

export const getFlashEvents = async (beneficiary: Address, swapperAddresses: Address[]) => {
  if (!swapperAddresses.length) return []

  const flashEvents = await publicClient.getLogs({
    address: swapperAddresses,
    event: {
      anonymous: false,
      inputs: [
        { indexed: true, internalType: 'address', name: 'beneficiary', type: 'address' },
        { indexed: true, internalType: 'address', name: 'trader', type: 'address' },
        {
          components: [
            {
              components: [
                { internalType: 'address', name: 'base', type: 'address' },
                { internalType: 'address', name: 'quote', type: 'address' }
              ],
              internalType: 'struct QuotePair',
              name: 'quotePair',
              type: 'tuple'
            },
            { internalType: 'uint128', name: 'baseAmount', type: 'uint128' },
            { internalType: 'bytes', name: 'data', type: 'bytes' }
          ],
          indexed: false,
          internalType: 'struct QuoteParams[]',
          name: 'quoteParams',
          type: 'tuple[]'
        },
        { indexed: false, internalType: 'address', name: 'tokenToBeneficiary', type: 'address' },
        { indexed: false, internalType: 'uint256[]', name: 'amountsToBeneficiary', type: 'uint256[]' },
        { indexed: false, internalType: 'uint256', name: 'excessToBeneficiary', type: 'uint256' }
      ],
      name: 'Flash',
      type: 'event'
    },
    args: { beneficiary },
    fromBlock: prizeVault.deployedAtBlock,
    toBlock: 'latest',
    strict: true
  })

  return flashEvents
}

export const getSetSwapperEvents = async (userAddress: Address, tokenOut?: Address) => {
  const setSwapperEvents = await publicClient.getLogs({
    address: prizeHookAddress,
    event: {
      anonymous: false,
      inputs: [
        { indexed: true, internalType: 'address', name: 'account', type: 'address' },
        { indexed: true, internalType: 'address', name: 'newTokenOut', type: 'address' },
        { indexed: true, internalType: 'contract ISwapper', name: 'newSwapper', type: 'address' },
        { indexed: false, internalType: 'address', name: 'previousSwapper', type: 'address' }
      ],
      name: 'SetSwapper',
      type: 'event'
    },
    args: { account: userAddress, newTokenOut: tokenOut },
    fromBlock: prizeVault.deployedAtBlock,
    toBlock: 'latest',
    strict: true
  })

  return setSwapperEvents
}
