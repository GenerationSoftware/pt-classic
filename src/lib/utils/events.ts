import { prizeHookAddress, prizePool, prizeVault, twabRewardsAddress, twabRewardsTokenOptions } from '$lib/config'
import { publicClient } from '$lib/constants'
import type { Address } from 'viem'

export const getTransferEvents = async (
  address: Address,
  tokenAddress: Address,
  options?: { filter?: 'from' | 'to'; fromBlock?: bigint }
) => {
  const transferEvent = {
    type: 'event',
    name: 'Transfer',
    inputs: [
      { indexed: true, name: 'from', type: 'address' },
      { indexed: true, name: 'to', type: 'address' },
      { indexed: false, name: 'value', type: 'uint256' }
    ]
  } as const

  const fromTransferEvents =
    options?.filter === 'to'
      ? []
      : await publicClient.getLogs({
          address: tokenAddress,
          event: transferEvent,
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
          event: transferEvent,
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

export const getSetSwapperEvents = async (userAddress: Address) => {
  const setSwapperEvents = await publicClient.getLogs({
    address: prizeHookAddress,
    event: {
      anonymous: false,
      inputs: [
        { indexed: true, internalType: 'address', name: 'account', type: 'address' },
        { indexed: true, internalType: 'address', name: 'newSwapper', type: 'address' },
        { indexed: true, internalType: 'address', name: 'previousSwapper', type: 'address' }
      ],
      name: 'SetSwapper',
      type: 'event'
    },
    args: { account: userAddress },
    fromBlock: prizeVault.deployedAtBlock,
    toBlock: 'latest',
    strict: true
  })

  return setSwapperEvents
}

export const getPromotionCreatedEvents = async () => {
  const promotionCreatedEvents = await publicClient.getLogs({
    address: twabRewardsAddress,
    event: {
      anonymous: false,
      inputs: [
        { indexed: true, internalType: 'uint256', name: 'promotionId', type: 'uint256' },
        { indexed: true, internalType: 'address', name: 'vault', type: 'address' },
        { indexed: true, internalType: 'contract IERC20', name: 'token', type: 'address' },
        { indexed: false, internalType: 'uint64', name: 'startTimestamp', type: 'uint64' },
        { indexed: false, internalType: 'uint256', name: 'tokensPerEpoch', type: 'uint256' },
        { indexed: false, internalType: 'uint48', name: 'epochDuration', type: 'uint48' },
        { indexed: false, internalType: 'uint8', name: 'initialNumberOfEpochs', type: 'uint8' }
      ],
      name: 'PromotionCreated',
      type: 'event'
    },
    args: {
      vault: prizeVault.address,
      token: twabRewardsTokenOptions.map((t) => t.address)
    },
    fromBlock: prizeVault.deployedAtBlock,
    toBlock: 'latest',
    strict: true
  })

  return promotionCreatedEvents
}

export const getRewardsClaimedEvents = async (userAddress: Address) => {
  const rewardsClaimedEvents = await publicClient.getLogs({
    address: twabRewardsAddress,
    event: {
      anonymous: false,
      inputs: [
        { indexed: true, internalType: 'uint256', name: 'promotionId', type: 'uint256' },
        { indexed: false, internalType: 'uint8[]', name: 'epochIds', type: 'uint8[]' },
        { indexed: true, internalType: 'address', name: 'user', type: 'address' },
        { indexed: false, internalType: 'uint256', name: 'amount', type: 'uint256' }
      ],
      name: 'RewardsClaimed',
      type: 'event'
    },
    args: {
      user: userAddress
    },
    fromBlock: prizeVault.deployedAtBlock,
    toBlock: 'latest',
    strict: true
  })

  return rewardsClaimedEvents
}

export const getClaimedPrizeEvents = async (userAddress: Address, swapperAddresses: Address[]) => {
  const claimedPrizeEvents = await publicClient.getLogs({
    address: prizePool.address,
    event: {
      anonymous: false,
      inputs: [
        { indexed: true, internalType: 'address', name: 'vault', type: 'address' },
        { indexed: true, internalType: 'address', name: 'winner', type: 'address' },
        { indexed: true, internalType: 'address', name: 'recipient', type: 'address' },
        { indexed: false, internalType: 'uint24', name: 'drawId', type: 'uint24' },
        { indexed: false, internalType: 'uint8', name: 'tier', type: 'uint8' },
        { indexed: false, internalType: 'uint32', name: 'prizeIndex', type: 'uint32' },
        { indexed: false, internalType: 'uint152', name: 'payout', type: 'uint152' },
        { indexed: false, internalType: 'uint96', name: 'claimReward', type: 'uint96' },
        { indexed: false, internalType: 'address', name: 'claimRewardRecipient', type: 'address' }
      ],
      name: 'ClaimedPrize',
      type: 'event'
    },
    args: {
      vault: prizeVault.address,
      winner: userAddress,
      recipient: [userAddress, ...swapperAddresses]
    },
    fromBlock: prizeVault.deployedAtBlock,
    toBlock: 'latest',
    strict: true
  })

  return claimedPrizeEvents
}
