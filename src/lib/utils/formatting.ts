import { formatUnits, parseUnits, type Address } from 'viem'
import { prizePool, prizeVault } from '$lib/config'
import { seconds } from '$lib/constants'
import type { ClaimedReward, FlashEvent, TimeUnit } from '$lib/types'

export const lower = (address: Address) => {
  return address.toLowerCase() as Lowercase<Address>
}

export const formatPrize = (flashEvent: FlashEvent) => {
  const amount = flashEvent.args.amountsToBeneficiary.reduce((a, b) => a + b, 0n) + flashEvent.args.excessToBeneficiary

  return { txHash: flashEvent.transactionHash, blockNumber: flashEvent.blockNumber, amount, formattedAmount: formatShareAmount(amount) }
}

export const formatClaimedReward = (claimedReward: ClaimedReward, tokenPrice: number) => {
  const tokenAmount = parseFloat(formatUnits(claimedReward.amount, claimedReward.token.decimals))
  const tokenValue = tokenAmount * tokenPrice

  const amount = parseUnits(`${tokenValue}`, prizeVault.decimals)

  return {
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
  }
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
