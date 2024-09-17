import { decodeEventLog, erc20Abi, type Address, type DecodeEventLogReturnType, type Hash, type TransactionReceipt } from 'viem'
import { chain, prizeHook, prizeVault } from '$lib/config'
import { userAddress, walletClient } from '$lib/stores'
import { hookABI, vaultABI } from '$lib/abis'
import { publicClient } from '$lib/constants'
import { lower } from './formatting'
import { get } from 'svelte/store'

export const approve = async (
  tokenAddress: Address,
  spenderAddress: Address,
  amount: bigint,
  options?: { onSend?: (txHash: Hash) => void; onSuccess?: (txReceipt: TransactionReceipt) => void; onSettled?: () => void }
) => {
  const client = get(walletClient)
  const user = get(userAddress)

  if (!client || !user) return

  try {
    const hash = await client.writeContract({
      chain,
      account: user,
      address: tokenAddress,
      abi: erc20Abi,
      functionName: 'approve',
      args: [spenderAddress, amount]
    })

    options?.onSend?.(hash)

    const txReceipt = await publicClient.waitForTransactionReceipt({ hash })

    if (txReceipt.status === 'success') {
      options?.onSuccess?.(txReceipt)
    } else {
      throw new Error(`approve tx reverted: ${hash}`)
    }
  } catch (e) {
    console.error(e)
  } finally {
    options?.onSettled?.()
  }
}

export const deposit = async (
  amount: bigint,
  options?: {
    onSend?: (txHash: Hash) => void
    onSuccess?: (txReceipt: TransactionReceipt, depositEvent: DecodeEventLogReturnType<typeof vaultABI, 'Deposit'>) => void
    onSettled?: () => void
  }
) => {
  const client = get(walletClient)
  const user = get(userAddress)

  if (!client || !user) return

  try {
    const hash = await client.writeContract({
      chain,
      account: user,
      address: prizeVault.address,
      abi: vaultABI,
      functionName: 'deposit',
      args: [amount, user]
    })

    options?.onSend?.(hash)

    const txReceipt = await publicClient.waitForTransactionReceipt({ hash })

    if (txReceipt.status === 'success') {
      const encodedEvent = txReceipt.logs.filter((log) => lower(log.address) === lower(prizeVault.address))[1]
      const event = decodeEventLog({ abi: vaultABI, eventName: 'Deposit', topics: encodedEvent.topics, strict: true })

      options?.onSuccess?.(txReceipt, event)
    } else {
      throw new Error(`deposit tx reverted: ${hash}`)
    }
  } catch (e) {
    console.error(e)
  } finally {
    options?.onSettled?.()
  }
}

export const redeem = async (
  amount: bigint,
  options?: {
    onSend?: (txHash: Hash) => void
    onSuccess?: (txReceipt: TransactionReceipt, withdrawEvent: DecodeEventLogReturnType<typeof vaultABI, 'Withdraw'>) => void
    onSettled?: () => void
  }
) => {
  const client = get(walletClient)
  const user = get(userAddress)

  if (!client || !user) return

  try {
    const hash = await client.writeContract({
      chain,
      account: user,
      address: prizeVault.address,
      abi: vaultABI,
      functionName: 'redeem',
      args: [amount, user, user, amount]
    })

    options?.onSend?.(hash)

    const txReceipt = await publicClient.waitForTransactionReceipt({ hash })

    if (txReceipt.status === 'success') {
      const encodedEvent = txReceipt.logs.filter((log) => lower(log.address) === lower(prizeVault.address))[1]
      const event = decodeEventLog({ abi: vaultABI, eventName: 'Withdraw', topics: encodedEvent.topics, strict: true })

      options?.onSuccess?.(txReceipt, event)
    } else {
      throw new Error(`redeem tx reverted: ${hash}`)
    }
  } catch (e) {
    console.error(e)
  } finally {
    options?.onSettled?.()
  }
}

export const setPrizeHook = async (options?: {
  onSend?: (txHash: Hash) => void
  onSuccess?: (txReceipt: TransactionReceipt) => void
  onSettled?: () => void
}) => {
  const client = get(walletClient)
  const user = get(userAddress)

  if (!client || !user) return

  try {
    const hash = await client.writeContract({
      chain,
      account: user,
      address: prizeVault.address,
      abi: vaultABI,
      functionName: 'setHooks',
      args: [{ useBeforeClaimPrize: true, useAfterClaimPrize: false, implementation: prizeHook.address }]
    })

    options?.onSend?.(hash)

    const txReceipt = await publicClient.waitForTransactionReceipt({ hash })

    if (txReceipt.status === 'success') {
      options?.onSuccess?.(txReceipt)
    } else {
      throw new Error(`setHooks tx reverted: ${hash}`)
    }
  } catch (e) {
    console.error(e)
  } finally {
    options?.onSettled?.()
  }
}

export const configurePrizeHook = async (options?: {
  onSend?: (txHash: Hash) => void
  onSuccess?: (txReceipt: TransactionReceipt) => void
  onSettled?: () => void
}) => {
  const client = get(walletClient)
  const user = get(userAddress)

  if (!client || !user) return

  try {
    const hash = await client.writeContract({
      chain,
      account: user,
      address: prizeHook.address,
      abi: hookABI,
      functionName: 'setPrizeSizeVoteAndSwapper',
      args: [prizeHook.minPrizeSize]
    })

    options?.onSend?.(hash)

    const txReceipt = await publicClient.waitForTransactionReceipt({ hash })

    if (txReceipt.status === 'success') {
      options?.onSuccess?.(txReceipt)
    } else {
      throw new Error(`setPrizeSizeVoteAndSwapper tx reverted: ${hash}`)
    }
  } catch (e) {
    console.error(e)
  } finally {
    options?.onSettled?.()
  }
}
