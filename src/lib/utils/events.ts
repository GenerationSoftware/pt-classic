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
import { eventQuerySettings, prizeHook, prizePool, prizeVault, twabRewards } from '$lib/config'
import { validateClientNetwork } from './providers'
import { get } from 'svelte/store'
import type { ClaimedPrizeEvent, FlashEvent, PromotionCreatedEvent, RewardsClaimedEvent, SetSwapperEvent, TransferEvent } from '$lib/types'
import type { AbiEvent, Address, GetLogsParameters, GetLogsReturnType } from 'viem'

const getPaginatedEvents = async <Event extends AbiEvent>(
  params: GetLogsParameters<Event, undefined, true, bigint, bigint | 'latest'> & {
    fromBlock: bigint
    toBlock: bigint | 'latest'
    args?: any
  }
) => {
  const publicClient = get(clients).public
  validateClientNetwork(publicClient)

  const events: GetLogsReturnType<Event, undefined, true, bigint, bigint, Event['name']> = []

  const maxBlock = params.toBlock === 'latest' ? await publicClient.getBlockNumber() : params.toBlock

  let fromBlock = params.fromBlock
  let toBlock = params.fromBlock + eventQuerySettings.maxPageSizeInBlocks - 1n

  if (toBlock > maxBlock) {
    toBlock = maxBlock
  }

  while (toBlock <= maxBlock) {
    const newEventsPage = await publicClient.getLogs<Event, undefined, true, bigint, bigint>({ ...params, fromBlock, toBlock })
    events.push(...newEventsPage)

    fromBlock = toBlock + 1n

    if (toBlock !== maxBlock && toBlock + eventQuerySettings.maxPageSizeInBlocks > maxBlock) {
      toBlock = maxBlock
    } else {
      toBlock += eventQuerySettings.maxPageSizeInBlocks
    }

    await new Promise((resolve) => setTimeout(resolve, eventQuerySettings.paginationDelay))
  }

  return events
}

const getTransferEvents = async (address: Address, tokenAddress: Address, options?: { filter?: 'from' | 'to'; fromBlock?: bigint }) => {
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
      : await getPaginatedEvents({
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
      : await getPaginatedEvents({
          address: tokenAddress,
          event: transferEvent,
          args: { to: address },
          fromBlock: options?.fromBlock ?? prizeVault.deployedAtBlock,
          toBlock: 'latest',
          strict: true
        })

  return [...fromTransferEvents, ...toTransferEvents]
}

const getFlashEvents = async (beneficiary: Address, swapperAddresses: Address[], options?: { fromBlock?: bigint }) => {
  if (!swapperAddresses.length) return []

  const flashEvents = await getPaginatedEvents({
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
    toBlock: 'latest',
    strict: true
  })

  return flashEvents
}

const getSetSwapperEvents = async (userAddress: Address, options?: { fromBlock?: bigint }) => {
  const setSwapperEvents = await getPaginatedEvents({
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
    toBlock: 'latest',
    strict: true
  })

  return setSwapperEvents
}

const getPromotionCreatedEvents = async (options?: { fromBlock?: bigint }) => {
  const promotionCreatedEvents = await getPaginatedEvents({
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
    toBlock: 'latest',
    strict: true
  })

  return promotionCreatedEvents
}

const getRewardsClaimedEvents = async (userAddress: Address, options?: { fromBlock?: bigint }) => {
  const rewardsClaimedEvents = await getPaginatedEvents({
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
    toBlock: 'latest',
    strict: true
  })

  return rewardsClaimedEvents
}

const getClaimedPrizeEvents = async (userAddress: Address, options?: { fromBlock?: bigint }) => {
  const claimedPrizeEvents = await getPaginatedEvents({
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
    toBlock: 'latest',
    strict: true
  })

  return claimedPrizeEvents
}

export const updateUserTransferEvents = async (userAddress: Address, oldTransferEvents: TransferEvent[]) => {
  const lastTransferEvent = oldTransferEvents.at(-1)

  const newTransferEvents = (
    await getTransferEvents(userAddress, prizeVault.address, {
      fromBlock: !!lastTransferEvent ? BigInt(lastTransferEvent.blockNumber) + 1n : undefined
    })
  ).map(formatTransferEvent)

  const updatedUserTransferEvents = [...oldTransferEvents, ...newTransferEvents]
  userTransferEvents.set(updatedUserTransferEvents)

  return updatedUserTransferEvents
}

export const updateUserFlashEvents = async (userAddress: Address, swapperAddresses: Address[], oldFlashEvents: FlashEvent[]) => {
  const lastFlashEvent = oldFlashEvents.at(-1)

  const newFlashEvents = (
    await getFlashEvents(userAddress, swapperAddresses, {
      fromBlock: !!lastFlashEvent ? BigInt(lastFlashEvent.blockNumber) + 1n : undefined
    })
  ).map(formatFlashEvent)

  const updatedUserFlashEvents = [...oldFlashEvents, ...newFlashEvents]
  userFlashEvents.set(updatedUserFlashEvents)

  return updatedUserFlashEvents
}

export const updateUserClaimedPrizeEvents = async (userAddress: Address, oldClaimedPrizeEvents: ClaimedPrizeEvent[]) => {
  const lastClaimedPrizeEvent = oldClaimedPrizeEvents.at(-1)

  const newClaimedPrizeEvents = (
    await getClaimedPrizeEvents(userAddress, {
      fromBlock: !!lastClaimedPrizeEvent ? BigInt(lastClaimedPrizeEvent.blockNumber) + 1n : undefined
    })
  ).map(formatClaimedPrizeEvent)

  const updatedUserClaimedPrizeEvents = [...oldClaimedPrizeEvents, ...newClaimedPrizeEvents]
  userClaimedPrizeEvents.set(updatedUserClaimedPrizeEvents)

  return updatedUserClaimedPrizeEvents
}

export const updateUserSetSwapperEvents = async (userAddress: Address, oldSetSwapperEvents: SetSwapperEvent[]) => {
  const lastSetSwapperEvent = oldSetSwapperEvents.at(-1)

  const newSetSwapperEvents = (
    await getSetSwapperEvents(userAddress, {
      fromBlock: !!lastSetSwapperEvent ? BigInt(lastSetSwapperEvent.blockNumber) + 1n : undefined
    })
  ).map(formatSetSwapperEvent)

  const updatedUserSetSwapperEvents = [...oldSetSwapperEvents, ...newSetSwapperEvents]
  userSetSwapperEvents.set(updatedUserSetSwapperEvents)

  return updatedUserSetSwapperEvents
}

export const updateUserRewardsClaimedEvents = async (userAddress: Address, oldRewardsClaimedEvents: RewardsClaimedEvent[]) => {
  const lastRewardsClaimedEvent = oldRewardsClaimedEvents.at(-1)

  const newRewardsClaimedEvents = (
    await getRewardsClaimedEvents(userAddress, {
      fromBlock: !!lastRewardsClaimedEvent ? BigInt(lastRewardsClaimedEvent.blockNumber) + 1n : undefined
    })
  ).map(formatRewardsClaimedEvent)

  const updatedUserRewardsClaimedEvents = [...oldRewardsClaimedEvents, ...newRewardsClaimedEvents]
  userRewardsClaimedEvents.set(updatedUserRewardsClaimedEvents)

  return updatedUserRewardsClaimedEvents
}

export const updatePromotionCreatedEvents = async (oldPromotionCreatedEvents: PromotionCreatedEvent[]) => {
  const lastPromotionCreatedEvent = oldPromotionCreatedEvents.at(-1)

  const newPromotionCreatedEvents = (
    await getPromotionCreatedEvents({
      fromBlock: !!lastPromotionCreatedEvent ? BigInt(lastPromotionCreatedEvent.blockNumber) + 1n : undefined
    })
  ).map(formatPromotionCreatedEvent)

  const updatedPromotionCreatedEvents = [...oldPromotionCreatedEvents, ...newPromotionCreatedEvents]
  promotionCreatedEvents.set(updatedPromotionCreatedEvents)

  return updatedPromotionCreatedEvents
}
