import { getPromotionCreatedEvents, getRewardsClaimedEvents } from './events'
import { twabRewardsAddress, twabRewardsTokenOptions } from '$lib/config'
import { getCurrentTimestamp } from './time'
import { twabRewardsABI } from '$lib/abis'
import { clients } from '$lib/stores'
import { lower } from './formatting'
import { get } from 'svelte/store'
import type { Address, ContractFunctionParameters, Hash } from 'viem'
import type { PromotionInfo, Token } from '$lib/types'

export const getPromotionInfo = async () => {
  const promotionInfo: {
    [id: string]: {
      creator: Address
      startTimestamp: bigint
      numberOfEpochs: number
      vault: Address
      epochDuration: number
      createdAt: number
      token: Address
      tokensPerEpoch: bigint
      rewardsUnclaimed: bigint
    }
  } = {}

  const publicClient = get(clients).public

  const promotionCreatedEvents = await getPromotionCreatedEvents()

  const promotionIds = promotionCreatedEvents.map((event) => event.args.promotionId)

  const contracts: ContractFunctionParameters<typeof twabRewardsABI, 'view', 'getPromotion'>[] = promotionIds.map((promotionId) => ({
    address: twabRewardsAddress,
    abi: twabRewardsABI,
    functionName: 'getPromotion',
    args: [promotionId]
  }))

  const multicall = await publicClient.multicall({ contracts })

  promotionIds.forEach((promotionId, i) => {
    if (multicall[i].status === 'success' && typeof multicall[i].result === 'object') {
      promotionInfo[promotionId.toString()] = multicall[i].result
    }
  })

  return promotionInfo
}

export const getUserClaimedRewards = async (promotionInfo: PromotionInfo, userAddress: Address) => {
  const claimed: { txHash: Hash; blockNumber: bigint; token: Token; amount: bigint }[] = []

  const rewardsClaimedEvents = await getRewardsClaimedEvents(userAddress)

  rewardsClaimedEvents.forEach((claimEvent) => {
    const tokenAddress = promotionInfo[claimEvent.args.promotionId.toString()]?.token
    const token = !!tokenAddress ? twabRewardsTokenOptions.find((t) => lower(t.address) === lower(tokenAddress)) : undefined

    if (!!token) {
      const existingClaimIndex = claimed.findIndex(
        (claim) => claim.txHash === claimEvent.transactionHash && lower(claim.token.address) === lower(token.address)
      )

      if (existingClaimIndex === -1) {
        claimed.push({ txHash: claimEvent.transactionHash, blockNumber: claimEvent.blockNumber, token, amount: claimEvent.args.amount })
      } else {
        claimed[existingClaimIndex].amount += claimEvent.args.amount
      }
    }
  })

  return claimed
}

export const getUserClaimableRewards = async (promotionInfo: PromotionInfo, userAddress: Address) => {
  const claimable: { promotionId: string; token: Token; epochs: { [epochId: number]: bigint } }[] = []
  const promotionEpochs: { [promotionId: string]: number[] } = {}

  const publicClient = get(clients).public

  Object.entries(promotionInfo).forEach(([promotionId, info]) => {
    const epochIds = getPromotionEpochIds(info)

    if (epochIds.length > 0) {
      promotionEpochs[promotionId] = epochIds
    }
  })

  const promotionIds = Object.keys(promotionEpochs)

  if (promotionIds.length > 0) {
    const contracts: ContractFunctionParameters<typeof twabRewardsABI, 'view', 'getRewardsAmount'>[] = promotionIds.map((promotionId) => ({
      address: twabRewardsAddress,
      abi: twabRewardsABI,
      functionName: 'getRewardsAmount',
      args: [userAddress, BigInt(promotionId), promotionEpochs[promotionId]]
    }))

    const multicall = await publicClient.multicall({ contracts })

    promotionIds.forEach((promotionId, i) => {
      const tokenAddress = promotionInfo[promotionId]?.token
      const token = !!tokenAddress ? twabRewardsTokenOptions.find((t) => lower(t.address) === lower(tokenAddress)) : undefined

      if (!!token && multicall[i].status === 'success' && typeof multicall[i].result === 'object') {
        const epochs: { [epochId: number]: bigint } = {}

        promotionEpochs[promotionId].forEach((epochId, j) => {
          const epochRewards = multicall[i].result?.[j]

          if (!!epochRewards) {
            epochs[epochId] = epochRewards
          }
        })

        claimable.push({ promotionId, token, epochs })
      }
    })
  }

  return claimable
}

export const getPromotionEpochIds = (info: PromotionInfo[string]) => {
  const epochIds: number[] = []

  const { startTimestamp, numberOfEpochs, epochDuration } = info

  if (!!startTimestamp && !!numberOfEpochs && !!epochDuration) {
    const currentTimestamp = getCurrentTimestamp()

    for (let i = 0; i < numberOfEpochs; i++) {
      const epochEndsAt = Number(startTimestamp) + epochDuration * (i + 1)

      if (epochEndsAt > currentTimestamp) {
        break
      } else {
        epochIds.push(i)
      }
    }
  }

  return epochIds
}
