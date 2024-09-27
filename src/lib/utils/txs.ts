import {
  decodeEventLog,
  encodeFunctionData,
  erc20Abi,
  parseEther,
  zeroAddress,
  type Address,
  type ContractFunctionParameters,
  type Hash,
  type TransactionReceipt
} from 'viem'
import { chain, prizeHook, prizePool, prizeVault, twabRewards } from '$lib/config'
import { hookABI, swapperABI, twabRewardsABI, vaultABI } from '$lib/abis'
import { validateClientNetwork } from './providers'
import { clients, userAddress } from '$lib/stores'
import { lower } from './formatting'
import { get } from 'svelte/store'

export const getGasBuffer = (gasEstimate: bigint) => {
  return (gasEstimate * parseEther('1.2')) / 10n ** 18n
}

export const sendTx = async (
  txRequest: ContractFunctionParameters,
  options?: { onSend?: (txHash: Hash) => void; onSuccess?: (txReceipt: TransactionReceipt) => void; onSettled?: () => void }
) => {
  const publicClient = get(clients).public
  const walletClient = get(clients).wallet
  const user = get(userAddress)

  if (!walletClient || !user) return

  validateClientNetwork(walletClient)

  try {
    const gasEstimate = await publicClient.estimateContractGas({ account: user, ...txRequest })

    const hash = await walletClient.writeContract({ chain, account: user, ...txRequest, gas: getGasBuffer(gasEstimate) })

    options?.onSend?.(hash)

    const txReceipt = await publicClient.waitForTransactionReceipt({ hash })

    if (txReceipt.status === 'success') {
      options?.onSuccess?.(txReceipt)
    } else {
      throw new Error(`${txRequest.functionName} tx reverted: ${hash}`)
    }
  } catch (e) {
    console.error(e)
  } finally {
    options?.onSettled?.()
  }
}

export const approve = async (tokenAddress: Address, spenderAddress: Address, amount: bigint, options?: Parameters<typeof sendTx>[1]) => {
  return await sendTx({ address: tokenAddress, abi: erc20Abi, functionName: 'approve', args: [spenderAddress, amount] }, options)
}

export const decodeDepositEvent = (depositTxReceipt: TransactionReceipt) => {
  const { topics, data } = depositTxReceipt.logs.filter((log) => lower(log.address) === lower(prizeVault.address))[1]
  return decodeEventLog({ abi: vaultABI, eventName: 'Deposit', topics, data, strict: true })
}

export const deposit = async (
  amount: bigint,
  options?: {
    onSend?: (txHash: Hash) => void
    onSuccess?: (txReceipt: TransactionReceipt, depositEvent: ReturnType<typeof decodeDepositEvent>) => void
    onSettled?: () => void
  }
) => {
  return await sendTx(
    { address: prizeVault.address, abi: vaultABI, functionName: 'deposit', args: [amount, get(userAddress)] },
    { ...options, onSuccess: (txReceipt) => options?.onSuccess?.(txReceipt, decodeDepositEvent(txReceipt)) }
  )
}

export const depositZap = async (
  zapTxRequest: ContractFunctionParameters,
  options?: {
    onSend?: (txHash: Hash) => void
    onSuccess?: (txReceipt: TransactionReceipt, depositEvent: ReturnType<typeof decodeDepositEvent>) => void
    onSettled?: () => void
  }
) => {
  return await sendTx(zapTxRequest, {
    ...options,
    onSuccess: (txReceipt) => options?.onSuccess?.(txReceipt, decodeDepositEvent(txReceipt))
  })
}

export const decodeWithdrawEvent = (redeemTxReceipt: TransactionReceipt) => {
  const { topics, data } = redeemTxReceipt.logs.filter((log) => lower(log.address) === lower(prizeVault.address))[1]
  return decodeEventLog({ abi: vaultABI, eventName: 'Withdraw', topics, data, strict: true })
}

export const redeem = async (
  amount: bigint,
  options?: {
    onSend?: (txHash: Hash) => void
    onSuccess?: (txReceipt: TransactionReceipt, withdrawEvent: ReturnType<typeof decodeWithdrawEvent>) => void
    onSettled?: () => void
  }
) => {
  return await sendTx(
    { address: prizeVault.address, abi: vaultABI, functionName: 'redeem', args: [amount, get(userAddress), get(userAddress), amount] },
    { ...options, onSuccess: (txReceipt) => options?.onSuccess?.(txReceipt, decodeWithdrawEvent(txReceipt)) }
  )
}

export const setPrizeHook = async (options?: Parameters<typeof sendTx>[1]) => {
  return await sendTx(
    {
      address: prizeVault.address,
      abi: vaultABI,
      functionName: 'setHooks',
      args: [{ useBeforeClaimPrize: true, useAfterClaimPrize: false, implementation: prizeHook.address }]
    },
    options
  )
}

export const unsetPrizeHook = async (options?: Parameters<typeof sendTx>[1]) => {
  return await sendTx(
    {
      address: prizeVault.address,
      abi: vaultABI,
      functionName: 'setHooks',
      args: [{ useBeforeClaimPrize: false, useAfterClaimPrize: false, implementation: zeroAddress }]
    },
    options
  )
}

export const configurePrizeHook = async (options?: Parameters<typeof sendTx>[1]) => {
  return await sendTx(
    { address: prizeHook.address, abi: hookABI, functionName: 'setPrizeSizeVoteAndSwapper', args: [prizeHook.minPrizeSize] },
    options
  )
}

export const claimBonusRewards = async (
  data: { promotionId: string; epochs: { [epochId: number]: bigint } }[],
  options?: Parameters<typeof sendTx>[1]
) => {
  const validPromotionEpochs: { promotionId: string; epochIds: number[] }[] = []

  const user = get(userAddress)

  data.forEach(({ promotionId, epochs }) => {
    const epochIds: number[] = []

    Object.entries(epochs).forEach(([epochId, amount]) => {
      !!amount && epochIds.push(Number(epochId))
    })

    if (!!epochIds.length) {
      validPromotionEpochs.push({ promotionId, epochIds })
    }
  })

  if (!user || !validPromotionEpochs.length) return

  if (validPromotionEpochs.length === 1) {
    return await sendTx(
      {
        address: twabRewards.address,
        abi: twabRewardsABI,
        functionName: 'claimRewards',
        args: [user, BigInt(validPromotionEpochs[0].promotionId), validPromotionEpochs[0].epochIds]
      },
      options
    )
  } else {
    return await sendTx(
      {
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
      },
      options
    )
  }
}

export const compoundPrizes = async (options?: Parameters<typeof sendTx>[1]) => {
  return await sendTx(
    { address: prizeHook.address, abi: hookABI, functionName: 'compoundAccounts', args: [[get(userAddress)], get(userAddress), 1n] },
    options
  )
}

export const retireSwapper = async (options?: Parameters<typeof sendTx>[1]) => {
  return await sendTx({ address: prizeHook.address, abi: hookABI, functionName: 'removeAndRecoverSwapper' }, options)
}

export const rescueSwapperFunds = async (swapper: { address: Address; balance: bigint }, options?: Parameters<typeof sendTx>[1]) => {
  const transferData = encodeFunctionData({ abi: erc20Abi, functionName: 'transfer', args: [get(userAddress)!, swapper.balance] })

  return await sendTx(
    {
      address: swapper.address,
      abi: swapperABI,
      functionName: 'execCalls',
      args: [[{ to: prizePool.prizeToken.address, value: 0n, data: transferData }]]
    },
    options
  )
}
