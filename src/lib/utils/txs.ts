import {
  decodeEventLog,
  encodeFunctionData,
  erc20Abi,
  type Address,
  type DecodeEventLogReturnType,
  type Hash,
  type TransactionReceipt
} from 'viem'
import { chain, prizeHook, prizeVault, twabRewards } from '$lib/config'
import { hookABI, twabRewardsABI, vaultABI } from '$lib/abis'
import { validateClientNetwork } from './providers'
import { clients, userAddress } from '$lib/stores'
import { lower } from './formatting'
import { get } from 'svelte/store'

export const approve = async (
  tokenAddress: Address,
  spenderAddress: Address,
  amount: bigint,
  options?: { onSend?: (txHash: Hash) => void; onSuccess?: (txReceipt: TransactionReceipt) => void; onSettled?: () => void }
) => {
  const publicClient = get(clients).public
  const walletClient = get(clients).wallet
  const user = get(userAddress)

  if (!walletClient || !user) return

  validateClientNetwork(walletClient)

  try {
    const hash = await walletClient.writeContract({
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
  const publicClient = get(clients).public
  const walletClient = get(clients).wallet
  const user = get(userAddress)

  if (!walletClient || !user) return

  validateClientNetwork(walletClient)

  try {
    const hash = await walletClient.writeContract({
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
      const { topics, data } = txReceipt.logs.filter((log) => lower(log.address) === lower(prizeVault.address))[1]
      const event = decodeEventLog({ abi: vaultABI, eventName: 'Deposit', topics, data, strict: true })

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
  const publicClient = get(clients).public
  const walletClient = get(clients).wallet
  const user = get(userAddress)

  if (!walletClient || !user) return

  validateClientNetwork(walletClient)

  try {
    const hash = await walletClient.writeContract({
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
      const { topics, data } = txReceipt.logs.filter((log) => lower(log.address) === lower(prizeVault.address))[1]
      const event = decodeEventLog({ abi: vaultABI, eventName: 'Withdraw', topics, data, strict: true })

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
  const publicClient = get(clients).public
  const walletClient = get(clients).wallet
  const user = get(userAddress)

  if (!walletClient || !user) return

  validateClientNetwork(walletClient)

  try {
    const hash = await walletClient.writeContract({
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
  const publicClient = get(clients).public
  const walletClient = get(clients).wallet
  const user = get(userAddress)

  if (!walletClient || !user) return

  validateClientNetwork(walletClient)

  try {
    const hash = await walletClient.writeContract({
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

export const claimBonusRewards = async (
  data: { promotionId: string; epochs: { [epochId: number]: bigint } }[],
  options?: {
    onSend?: (txHash: Hash) => void
    onSuccess?: (txReceipt: TransactionReceipt) => void
    onSettled?: () => void
  }
) => {
  const publicClient = get(clients).public
  const walletClient = get(clients).wallet
  const user = get(userAddress)

  if (!walletClient || !user) return

  validateClientNetwork(walletClient)

  const validPromotionEpochs: { promotionId: string; epochIds: number[] }[] = []
  data.forEach(({ promotionId, epochs }) => {
    const epochIds: number[] = []

    Object.entries(epochs).forEach(([epochId, amount]) => {
      !!amount && epochIds.push(Number(epochId))
    })

    if (!!epochIds.length) {
      validPromotionEpochs.push({ promotionId, epochIds })
    }
  })

  if (!validPromotionEpochs.length) return

  try {
    const txPromise =
      validPromotionEpochs.length === 1
        ? walletClient.writeContract({
            chain,
            account: user,
            address: twabRewards.address,
            abi: twabRewardsABI,
            functionName: 'claimRewards',
            args: [user, BigInt(validPromotionEpochs[0].promotionId), validPromotionEpochs[0].epochIds]
          })
        : walletClient.writeContract({
            chain,
            account: user,
            address: twabRewards.address,
            abi: twabRewardsABI,
            functionName: 'multicall',
            args: [
              validPromotionEpochs.map((entry) =>
                encodeFunctionData({
                  abi: twabRewardsABI,
                  functionName: 'claimRewards',
                  args: [user, BigInt(entry.promotionId), entry.epochIds]
                })
              )
            ]
          })

    const hash = await txPromise

    options?.onSend?.(hash)

    const txReceipt = await publicClient.waitForTransactionReceipt({ hash })

    if (txReceipt.status === 'success') {
      options?.onSuccess?.(txReceipt)
    } else {
      throw new Error(`${validPromotionEpochs.length === 1 ? 'claimRewards' : 'multicall'} tx reverted: ${hash}`)
    }
  } catch (e) {
    console.error(e)
  } finally {
    options?.onSettled?.()
  }
}
