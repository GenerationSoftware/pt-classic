<script lang="ts">
  import { userAddress, userBalances, userTransferEvents, walletClient } from '$lib/stores'
  import { decodeEventLog, erc20Abi, type TransactionReceipt } from 'viem'
  import { getTokenBalances, getTransferEvents, lower } from '$lib/utils'
  import { chain, prizeVault } from '$lib/config'
  import { publicClient } from '$lib/constants'
  import { vaultABI } from '$lib/abis'

  export let amount: bigint
  export let disabled: boolean = false
  export let onSuccess: (txReceipt: TransactionReceipt, amount: bigint) => void = () => {}
  let allowance: bigint | undefined = undefined
  let isApproving: boolean = false
  let isDepositing: boolean = false

  const updateAllowance = async () => {
    if (!!$userAddress) {
      allowance = await publicClient.readContract({
        address: prizeVault.asset.address,
        abi: erc20Abi,
        functionName: 'allowance',
        args: [$userAddress, prizeVault.address]
      })
    }
  }

  $: $userAddress, updateAllowance()

  const updateBalances = async () => {
    if (!!$userAddress) {
      const updatedBalances = await getTokenBalances($userAddress, [prizeVault.address, prizeVault.asset.address])
      userBalances.update((oldBalances) => ({ ...oldBalances, ...updatedBalances }))
    }
  }

  const updateTransferEvents = async () => {
    if (!!$userTransferEvents && !!$userAddress) {
      const lastTransferEvent = $userTransferEvents.at(-1)
      const newTransferEvents = await getTransferEvents($userAddress, prizeVault.address, {
        fromBlock: !!lastTransferEvent ? lastTransferEvent.blockNumber + 1n : undefined
      })
      userTransferEvents.update((oldTransferEvents) => [...(oldTransferEvents ?? []), ...newTransferEvents])
    }
  }

  const approve = async () => {
    if (!!$walletClient && !!$userAddress) {
      try {
        isApproving = true
        const hash = await $walletClient.writeContract({
          chain,
          account: $userAddress,
          address: prizeVault.asset.address,
          abi: erc20Abi,
          functionName: 'approve',
          args: [prizeVault.address, amount]
        })
        await publicClient.waitForTransactionReceipt({ hash })
      } catch (e) {
        console.error(e)
      } finally {
        isApproving = false
        updateAllowance()
      }
    }
  }

  const deposit = async () => {
    if (!!$walletClient && !!$userAddress) {
      try {
        isDepositing = true
        const hash = await $walletClient.writeContract({
          chain,
          account: $userAddress,
          address: prizeVault.address,
          abi: vaultABI,
          functionName: 'deposit',
          args: [amount, $userAddress]
        })
        const txReceipt = await publicClient.waitForTransactionReceipt({ hash })

        if (txReceipt.status === 'success') {
          updateTransferEvents()

          const encodedEvent = txReceipt.logs.filter((log) => lower(log.address) === lower(prizeVault.address))[1]
          const event = decodeEventLog({ abi: vaultABI, eventName: 'Deposit', topics: encodedEvent.topics, strict: true })

          onSuccess(txReceipt, event.args.assets)
        } else {
          throw new Error(`deposit tx reverted: ${hash}`)
        }
      } catch (e) {
        console.error(e)
      } finally {
        isDepositing = false
        updateAllowance()
        updateBalances()
      }
    }
  }
</script>

{#if !$walletClient || !$userAddress || !amount || allowance === undefined}
  <button class="teal-button" disabled={true}>Deposit</button>
{:else if allowance < amount}
  <button type="submit" on:click={approve} class="teal-button" disabled={isApproving || disabled}>Approve</button>
{:else}
  <button type="submit" on:click={deposit} class="teal-button" disabled={isDepositing || disabled}>Deposit</button>
{/if}
