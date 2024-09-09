import { erc20Abi, formatUnits, zeroAddress, type Address } from 'viem'
import { dolphinAddress, publicClient } from './constants'
import { prizeHookAddress, prizeVault } from './config'
import { blockTimestamps } from './stores'
import { vaultABI } from './abis/vaultABI'
import { get } from 'svelte/store'
import type { FlashEvent } from './types'

export const lower = (address: Address) => {
  return address.toLowerCase() as Lowercase<Address>
}

export const formatPrize = (flashEvent: FlashEvent) => {
  const amount = flashEvent.args.amountsToBeneficiary.reduce((a, b) => a + b, 0n) + flashEvent.args.excessToBeneficiary

  return { txHash: flashEvent.transactionHash, blockNumber: flashEvent.blockNumber, amount, formattedAmount: formatShareAmount(amount) }
}

export const formatShareAmount = (amount: bigint) => {
  return parseFloat(formatUnits(amount, prizeVault.decimals)).toLocaleString('en', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
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

export const getPrizeHookStatus = async (
  userAddress: Address
): Promise<
  | { isPrizeHookSet: boolean; isSwapperSet: false; pastSwapperAddresses: Address[] }
  | { isPrizeHookSet: boolean; isSwapperSet: true; swapperAddress: Address; pastSwapperAddresses: Address[] }
> => {
  let isPrizeHookSet = false

  const hook = await publicClient.readContract({
    address: prizeVault.address,
    abi: vaultABI,
    functionName: 'getHooks',
    args: [userAddress]
  })

  if (lower(hook.implementation) === prizeHookAddress && !!hook.useBeforeClaimPrize) {
    isPrizeHookSet = true
  }

  const setSwapperEvents = await getSetSwapperEvents(userAddress, prizeVault.address)

  if (!!setSwapperEvents.length) {
    const swapperAddresses = [...new Set<Address>(setSwapperEvents.map((e) => e.args.newSwapper))]

    const swapperAddress = swapperAddresses.pop() // TODO: make sure the last event is the most recent one
    const pastSwapperAddresses = swapperAddresses.filter((a) => a !== zeroAddress)

    if (!!swapperAddress && swapperAddress !== zeroAddress) {
      return { isPrizeHookSet, isSwapperSet: true, swapperAddress, pastSwapperAddresses }
    } else {
      return { isPrizeHookSet, isSwapperSet: false, pastSwapperAddresses }
    }
  }

  return { isPrizeHookSet, isSwapperSet: false, pastSwapperAddresses: [] }
}

export const getBlockTimestamp = async (blockNumber: bigint) => {
  const existingBlockTimestamp = get(blockTimestamps)[Number(blockNumber)]
  if (!!existingBlockTimestamp) return existingBlockTimestamp

  const block = await publicClient.getBlock({ blockNumber, includeTransactions: false })

  blockTimestamps.update((oldBlockTimestamps) => ({ ...oldBlockTimestamps, [Number(blockNumber)]: Number(block.timestamp) }))

  return Number(block.timestamp)
}

export const getTransferEvents = async (address: Address, tokenAddress: Address, options?: { filter?: 'from' | 'to' }) => {
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
          fromBlock: prizeVault.deployedAtBlock,
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
          fromBlock: prizeVault.deployedAtBlock,
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
