import { updatePromotionCreatedEvents, updateUserRewardsClaimedEvents } from './events'
import { clients, promotionCreatedEvents, userRewardsClaimedEvents } from '$lib/stores'
import { validateClientNetwork } from './providers'
import { getCurrentTimestamp } from './time'
import { twabRewardsABI } from '$lib/abis'
import { twabRewards } from '$lib/config'
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
  validateClientNetwork(publicClient)

  const updatedPromotionCreatedEvents = await updatePromotionCreatedEvents(get(promotionCreatedEvents) ?? [])

  const promotionIds = updatedPromotionCreatedEvents.map((event) => event.args.promotionId)

  const contracts: ContractFunctionParameters<typeof twabRewardsABI, 'view', 'getPromotion'>[] = promotionIds.map((promotionId) => ({
    address: twabRewards.address,
    abi: twabRewardsABI,
    functionName: 'getPromotion',
    args: [BigInt(promotionId)]
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

  const updatedRewardsClaimedEvents = await updateUserRewardsClaimedEvents(userAddress, get(userRewardsClaimedEvents) ?? [])

  updatedRewardsClaimedEvents.forEach((claimEvent) => {
    const tokenAddress = promotionInfo[claimEvent.args.promotionId]?.token
    const token = !!tokenAddress ? twabRewards.tokenOptions.find((t) => lower(t.address) === lower(tokenAddress)) : undefined

    if (!!token) {
      const existingClaimIndex = claimed.findIndex(
        (claim) => claim.txHash === claimEvent.transactionHash && lower(claim.token.address) === lower(token.address)
      )

      if (existingClaimIndex === -1) {
        claimed.push({
          txHash: claimEvent.transactionHash,
          blockNumber: BigInt(claimEvent.blockNumber),
          token,
          amount: BigInt(claimEvent.args.amount)
        })
      } else {
        claimed[existingClaimIndex].amount += BigInt(claimEvent.args.amount)
      }
    }
  })

  return claimed
}

export const getUserClaimableRewards = async (promotionInfo: PromotionInfo, userAddress: Address) => {
  const claimable: { promotionId: string; token: Token; epochs: { [epochId: number]: bigint } }[] = []
  const promotionEpochs: { [promotionId: string]: number[] } = {}

  const publicClient = get(clients).public
  validateClientNetwork(publicClient)

  Object.entries(promotionInfo).forEach(([promotionId, info]) => {
    const epochIds = getPromotionEpochIds(info)

    if (epochIds.length > 0) {
      promotionEpochs[promotionId] = epochIds
    }
  })

  const promotionIds = Object.keys(promotionEpochs)

  if (promotionIds.length > 0) {
    const contracts: ContractFunctionParameters<typeof twabRewardsABI, 'view', 'getRewardsAmount'>[] = promotionIds.map((promotionId) => ({
      address: twabRewards.address,
      abi: twabRewardsABI,
      functionName: 'getRewardsAmount',
      args: [userAddress, BigInt(promotionId), promotionEpochs[promotionId]]
    }))

    const multicall = await publicClient.multicall({ contracts })

    promotionIds.forEach((promotionId, i) => {
      const tokenAddress = promotionInfo[promotionId]?.token
      const token = !!tokenAddress ? twabRewards.tokenOptions.find((t) => lower(t.address) === lower(tokenAddress)) : undefined

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
