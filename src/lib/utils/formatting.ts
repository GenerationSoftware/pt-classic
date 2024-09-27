import { formatUnits, parseUnits, type Address } from 'viem'
import { prizePool, prizeVault } from '$lib/config'
import { seconds } from '$lib/constants'
import type {
  getClaimedPrizeEvents,
  getFlashEvents,
  getPromotionCreatedEvents,
  getRewardsClaimedEvents,
  getSetSwapperEvents,
  getTransferEvents
} from './events'
import type { ClaimedPrizeEvent, ClaimedReward, FlashEvent, TimeUnit, TokenPrices } from '$lib/types'

export const lower = (address: Address) => {
  return address.toLowerCase() as Lowercase<Address>
}

export const formatPrize = (flashEvent: FlashEvent) => {
  const amount = BigInt(flashEvent.args.amount)

  return {
    type: 'prize',
    txHash: flashEvent.transactionHash,
    blockNumber: BigInt(flashEvent.blockNumber),
    amount,
    formattedAmount: formatShareAmount(amount)
  } as const
}

export const formatFallbackPrize = (claimedPrizeEvent: ClaimedPrizeEvent, tokenPrices: TokenPrices) => {
  const prizeTokenAmount = parseFloat(formatUnits(BigInt(claimedPrizeEvent.args.payout), prizePool.prizeToken.decimals))
  const prizeTokenPrice = tokenPrices[lower(prizePool.prizeToken.address)] as number | undefined
  const prizeTokenValue = prizeTokenAmount * (prizeTokenPrice ?? 0)

  const amount = parseUnits(`${prizeTokenValue}`, prizeVault.decimals)

  return {
    type: 'fallbackPrize',
    txHash: claimedPrizeEvent.transactionHash,
    blockNumber: BigInt(claimedPrizeEvent.blockNumber),
    amount,
    formattedAmount: formatShareAmount(amount),
    token: {
      ...prizePool.prizeToken,
      price: prizeTokenPrice,
      amount: BigInt(claimedPrizeEvent.args.payout),
      formattedAmount: prizeTokenAmount.toLocaleString('en', { maximumFractionDigits: 4 })
    }
  } as const
}

export const formatClaimedReward = (claimedReward: ClaimedReward, tokenPrices: TokenPrices) => {
  const tokenAmount = parseFloat(formatUnits(claimedReward.amount, claimedReward.token.decimals))
  const tokenPrice = tokenPrices[lower(claimedReward.token.address)] as number | undefined
  const tokenValue = tokenAmount * (tokenPrice ?? 0)

  const amount = parseUnits(`${tokenValue}`, prizeVault.decimals)

  return {
    type: 'bonusReward',
    txHash: claimedReward.txHash,
    blockNumber: claimedReward.blockNumber,
    amount,
    formattedAmount: formatShareAmount(amount),
    token: {
      ...claimedReward.token,
      price: tokenPrice,
      amount: claimedReward.amount,
      formattedAmount: tokenAmount.toLocaleString('en', { maximumFractionDigits: 4 })
    }
  } as const
}

export const formatShareAmount = (amount: bigint) => {
  return parseFloat(formatUnits(amount, prizeVault.decimals)).toLocaleString('en', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

export const formatPrizeFrequency = (drawFrequency: number) => {
  if (!drawFrequency) return 'Never'

  const dailyFrequency = drawFrequency * (seconds.day / prizePool.drawPeriodSeconds)
  const days = 1 / dailyFrequency
  const weeks = days / 7
  const months = days / (365 / 12)
  const years = days / 365

  let relativeTimeUnit: TimeUnit = 'day'
  let relativeFrequency = 0

  if (weeks < 1.5 && prizePool.drawPeriodSeconds <= seconds.day) {
    relativeFrequency = days
  } else if (months < 1.5 && prizePool.drawPeriodSeconds <= seconds.week) {
    relativeFrequency = weeks
    relativeTimeUnit = 'week'
  } else if (years < 1.5 && prizePool.drawPeriodSeconds <= seconds.month) {
    relativeFrequency = months
    relativeTimeUnit = 'month'
  } else {
    relativeFrequency = years
    relativeTimeUnit = 'year'
  }

  const x = Math.round(relativeFrequency)
  const prizesPerTimeUnit = Math.round(1 / relativeFrequency)
  const formattedMultiplier = `${prizesPerTimeUnit.toLocaleString('en')}x`

  if (relativeTimeUnit === 'day') {
    if (relativeFrequency < 1.5) {
      return prizesPerTimeUnit > 1 ? `${formattedMultiplier} daily` : 'daily'
    } else {
      return `every ${x} days`
    }
  } else if (relativeTimeUnit === 'week') {
    if (relativeFrequency < 1.5) {
      return prizesPerTimeUnit > 1 ? `${formattedMultiplier} weekly` : 'weekly'
    } else {
      return `every ${x} weeks`
    }
  } else if (relativeTimeUnit === 'month') {
    if (relativeFrequency < 1.5) {
      return prizesPerTimeUnit > 1 ? `${formattedMultiplier} monthly` : 'monthly'
    } else {
      return `every ${x} months`
    }
  } else {
    if (relativeFrequency < 1.5) {
      return prizesPerTimeUnit > 1 ? `${formattedMultiplier} yearly` : 'yearly'
    } else {
      return `every ${x} years`
    }
  }
}

export const formatTransferEvent = (rawTransferEvent: Awaited<ReturnType<typeof getTransferEvents>>[number]) => {
  const { address, args, blockNumber, eventName, transactionHash } = rawTransferEvent

  return {
    address,
    args: {
      from: args.from,
      to: args.to,
      value: args.value.toString()
    },
    blockNumber: blockNumber.toString(),
    eventName,
    transactionHash
  }
}

export const formatFlashEvent = (rawFlashEvent: Awaited<ReturnType<typeof getFlashEvents>>[number]) => {
  const { address, args, blockNumber, eventName, transactionHash } = rawFlashEvent

  return {
    address,
    args: {
      beneficiary: args.beneficiary,
      trader: args.trader,
      amount: (args.amountsToBeneficiary.reduce((a, b) => a + b, 0n) + args.excessToBeneficiary).toString()
    },
    blockNumber: blockNumber.toString(),
    eventName,
    transactionHash
  }
}

export const formatClaimedPrizeEvent = (rawClaimedPrizeEvent: Awaited<ReturnType<typeof getClaimedPrizeEvents>>[number]) => {
  const { address, args, blockNumber, eventName, transactionHash } = rawClaimedPrizeEvent

  return {
    address,
    args: {
      vault: args.vault,
      winner: args.winner,
      recipient: args.recipient,
      drawId: args.drawId,
      tier: args.tier,
      payout: args.payout.toString()
    },
    blockNumber: blockNumber.toString(),
    eventName,
    transactionHash
  }
}

export const formatSetSwapperEvent = (rawSetSwapperEvent: Awaited<ReturnType<typeof getSetSwapperEvents>>[number]) => {
  const { address, args, blockNumber, eventName, transactionHash } = rawSetSwapperEvent

  return {
    address,
    args,
    blockNumber: blockNumber.toString(),
    eventName,
    transactionHash
  }
}

export const formatRewardsClaimedEvent = (rawRewardsClaimedEvent: Awaited<ReturnType<typeof getRewardsClaimedEvents>>[number]) => {
  const { address, args, blockNumber, eventName, transactionHash } = rawRewardsClaimedEvent

  return {
    address,
    args: {
      promotionId: args.promotionId.toString(),
      epochIds: args.epochIds,
      user: args.user,
      amount: args.amount.toString()
    },
    blockNumber: blockNumber.toString(),
    eventName,
    transactionHash
  }
}

export const formatPromotionCreatedEvent = (rawPromotionCreatedEvent: Awaited<ReturnType<typeof getPromotionCreatedEvents>>[number]) => {
  const { address, args, blockNumber, eventName, transactionHash } = rawPromotionCreatedEvent

  return {
    address,
    args: {
      promotionId: args.promotionId.toString(),
      vault: args.vault,
      token: args.token,
      startTimestamp: args.startTimestamp.toString()
    },
    blockNumber: blockNumber.toString(),
    eventName,
    transactionHash
  }
}
