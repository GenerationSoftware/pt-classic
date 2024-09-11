import { formatUnits, type Address } from 'viem'
import { prizeVault } from '$lib/config'
import type { FlashEvent } from '$lib/types'

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
