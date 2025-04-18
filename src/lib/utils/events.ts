import {
  clients,
  promotionCreatedEvents,
  userClaimedPrizeEvents,
  userFlashEvents,
  userRewardsClaimedEvents,
  userSetSwapperEvents,
  userTransferEvents
} from '$lib/stores'
import {
  formatClaimedPrizeEvent,
  formatFlashEvent,
  formatPromotionCreatedEvent,
  formatRewardsClaimedEvent,
  formatSetSwapperEvent,
  formatTransferEvent
} from './formatting'
import { prizeHook, prizePool, prizeVault, twabRewards } from '$lib/config'
import { get } from 'svelte/store'
import type { ClaimedPrizeEvent, FlashEvent, PromotionCreatedEvent, RewardsClaimedEvent, SetSwapperEvent, TransferEvent } from '$lib/types'
import type { Address } from 'viem'

export const getTransferEvents = async (
  address: Address,
  tokenAddress: Address,
  options?: { filter?: 'from' | 'to'; fromBlock?: bigint }
) => {
  const dskitClient = get(clients).dskit

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
      : await dskitClient.event.query({
          address: tokenAddress,
          event: transferEvent,
          args: { from: address },
          fromBlock: options?.fromBlock ?? prizeVault.deployedAtBlock,
          toBlock: 'latest'
        })

  const toTransferEvents =
    options?.filter === 'from'
      ? []
      : await dskitClient.event.query({
          address: tokenAddress,
          event: transferEvent,
          args: { to: address },
          fromBlock: options?.fromBlock ?? prizeVault.deployedAtBlock,
          toBlock: 'latest'
        })

  return [...fromTransferEvents, ...toTransferEvents]
}

export const getFlashEvents = async (beneficiary: Address, swapperAddresses: Address[], options?: { fromBlock?: bigint }) => {
  if (!swapperAddresses.length) return []

  const dskitClient = get(clients).dskit

  const flashEvents = await dskitClient.event.query({
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
    fromBlock: options?.fromBlock ?? prizeVault.deployedAtBlock,
    toBlock: 'latest'
  })

  return flashEvents
}

export const getSetSwapperEvents = async (userAddress: Address, options?: { fromBlock?: bigint }) => {
  const dskitClient = get(clients).dskit

  const setSwapperEvents = await dskitClient.event.query({
    address: prizeHook.address,
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
    fromBlock: options?.fromBlock ?? prizeVault.deployedAtBlock,
    toBlock: 'latest'
  })

  return setSwapperEvents
}

export const getPromotionCreatedEvents = async (options?: { fromBlock?: bigint }) => {
  const dskitClient = get(clients).dskit

  const promotionCreatedEvents = await dskitClient.event.query({
    address: twabRewards.address,
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
      token: twabRewards.tokenOptions.map((t) => t.address)
    },
    fromBlock: options?.fromBlock ?? prizeVault.deployedAtBlock,
    toBlock: 'latest'
  })

  return promotionCreatedEvents
}

export const getRewardsClaimedEvents = async (userAddress: Address, options?: { fromBlock?: bigint }) => {
  const dskitClient = get(clients).dskit

  const rewardsClaimedEvents = await dskitClient.event.query({
    address: twabRewards.address,
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
    fromBlock: options?.fromBlock ?? prizeVault.deployedAtBlock,
    toBlock: 'latest'
  })

  return rewardsClaimedEvents
}

export const getClaimedPrizeEvents = async (userAddress: Address, options?: { fromBlock?: bigint }) => {
  const dskitClient = get(clients).dskit

  const claimedPrizeEvents = await dskitClient.event.query({
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
      recipient: userAddress
    },
    fromBlock: options?.fromBlock ?? prizeVault.deployedAtBlock,
    toBlock: 'latest'
  })

  return claimedPrizeEvents
}

export const updateUserTransferEvents = async (userAddress: Address, oldTransferEvents: TransferEvent[]) => {
  const oldBlockNumbers = oldTransferEvents.map((e) => Number(e.blockNumber))
  const latestBlockNumber = !!oldBlockNumbers.length ? BigInt(Math.max(...oldBlockNumbers)) : undefined

  const newTransferEvents = (
    await getTransferEvents(userAddress, prizeVault.address, {
      fromBlock: !!latestBlockNumber ? latestBlockNumber + 1n : undefined
    })
  ).map(formatTransferEvent)

  const updatedUserTransferEvents = [...oldTransferEvents, ...newTransferEvents]
  userTransferEvents.set(updatedUserTransferEvents)

  return updatedUserTransferEvents
}

export const updateUserFlashEvents = async (userAddress: Address, swapperAddresses: Address[], oldFlashEvents: FlashEvent[]) => {
  const oldBlockNumbers = oldFlashEvents.map((e) => Number(e.blockNumber))
  const latestBlockNumber = !!oldBlockNumbers.length ? BigInt(Math.max(...oldBlockNumbers)) : undefined

  const newFlashEvents = (
    await getFlashEvents(userAddress, swapperAddresses, {
      fromBlock: !!latestBlockNumber ? latestBlockNumber + 1n : undefined
    })
  ).map(formatFlashEvent)

  const updatedUserFlashEvents = [...oldFlashEvents, ...newFlashEvents]
  userFlashEvents.set(updatedUserFlashEvents)

  return updatedUserFlashEvents
}

export const updateUserClaimedPrizeEvents = async (userAddress: Address, oldClaimedPrizeEvents: ClaimedPrizeEvent[]) => {
  const oldBlockNumbers = oldClaimedPrizeEvents.map((e) => Number(e.blockNumber))
  const latestBlockNumber = !!oldBlockNumbers.length ? BigInt(Math.max(...oldBlockNumbers)) : undefined

  const newClaimedPrizeEvents = (
    await getClaimedPrizeEvents(userAddress, {
      fromBlock: !!latestBlockNumber ? latestBlockNumber + 1n : undefined
    })
  )
    .map(formatClaimedPrizeEvent)
    .filter((e) => e.args.payout !== '0')

  const updatedUserClaimedPrizeEvents = [...oldClaimedPrizeEvents, ...newClaimedPrizeEvents]
  userClaimedPrizeEvents.set(updatedUserClaimedPrizeEvents)

  return updatedUserClaimedPrizeEvents
}

export const updateUserSetSwapperEvents = async (userAddress: Address, oldSetSwapperEvents: SetSwapperEvent[]) => {
  const oldBlockNumbers = oldSetSwapperEvents.map((e) => Number(e.blockNumber))
  const latestBlockNumber = !!oldBlockNumbers.length ? BigInt(Math.max(...oldBlockNumbers)) : undefined

  const newSetSwapperEvents = (
    await getSetSwapperEvents(userAddress, {
      fromBlock: !!latestBlockNumber ? latestBlockNumber + 1n : undefined
    })
  ).map(formatSetSwapperEvent)

  const updatedUserSetSwapperEvents = [...oldSetSwapperEvents, ...newSetSwapperEvents]
  userSetSwapperEvents.set(updatedUserSetSwapperEvents)

  return updatedUserSetSwapperEvents
}

export const updateUserRewardsClaimedEvents = async (userAddress: Address, oldRewardsClaimedEvents: RewardsClaimedEvent[]) => {
  const oldBlockNumbers = oldRewardsClaimedEvents.map((e) => Number(e.blockNumber))
  const latestBlockNumber = !!oldBlockNumbers.length ? BigInt(Math.max(...oldBlockNumbers)) : undefined

  const newRewardsClaimedEvents = (
    await getRewardsClaimedEvents(userAddress, {
      fromBlock: !!latestBlockNumber ? latestBlockNumber + 1n : undefined
    })
  ).map(formatRewardsClaimedEvent)

  const updatedUserRewardsClaimedEvents = [...oldRewardsClaimedEvents, ...newRewardsClaimedEvents]
  userRewardsClaimedEvents.set(updatedUserRewardsClaimedEvents)

  return updatedUserRewardsClaimedEvents
}

export const updatePromotionCreatedEvents = async (oldPromotionCreatedEvents: PromotionCreatedEvent[]) => {
  const oldBlockNumbers = oldPromotionCreatedEvents.map((e) => Number(e.blockNumber))
  const latestBlockNumber = !!oldBlockNumbers.length ? BigInt(Math.max(...oldBlockNumbers)) : undefined

  const newPromotionCreatedEvents = (
    await getPromotionCreatedEvents({
      fromBlock: !!latestBlockNumber ? latestBlockNumber + 1n : undefined
    })
  ).map(formatPromotionCreatedEvent)

  const updatedPromotionCreatedEvents = [...oldPromotionCreatedEvents, ...newPromotionCreatedEvents]
  promotionCreatedEvents.set(updatedPromotionCreatedEvents)

  return updatedPromotionCreatedEvents
}
