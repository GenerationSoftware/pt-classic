<script lang="ts">
  import { userAddress, userBalances, userTransferEvents, walletClient } from '$lib/stores'
  import { getTokenBalances, getTransferEvents } from '$lib/utils'
  import { chain, prizeVault } from '$lib/config'
  import { publicClient } from '$lib/constants'
  import { vaultABI } from '$lib/abis'

  export let amount: bigint
  export let disabled: boolean = false
  export let onSuccess: () => void = () => {}
  let isWithdrawing: boolean = false

  const updateBalances = async () => {
    if (!!$userAddress) {
      const updatedBalances = await getTokenBalances($userAddress, [prizeVault.address, prizeVault.asset.address])
      userBalances.update((oldBalances) => ({ ...oldBalances, ...updatedBalances }))
    }
  }

  const updateTransferEvents = async () => {
    if (!!$userAddress) {
      const lastTransferEvent = $userTransferEvents.at(-1)
      const newTransferEvents = await getTransferEvents($userAddress, prizeVault.address, {
        fromBlock: !!lastTransferEvent ? lastTransferEvent.blockNumber + 1n : undefined
      })
      userTransferEvents.update((oldTransferEvents) => [...oldTransferEvents, ...newTransferEvents])
    }
  }

  const withdraw = async () => {
    if (!!$walletClient && !!$userAddress) {
      try {
        isWithdrawing = true
        const hash = await $walletClient.writeContract({
          chain,
          account: $userAddress,
          address: prizeVault.address,
          abi: vaultABI,
          functionName: 'redeem',
          args: [amount, $userAddress, $userAddress, amount]
        })
        const txReceipt = await publicClient.waitForTransactionReceipt({ hash })

        if (txReceipt.status === 'success') {
          updateTransferEvents()
          onSuccess()
        } else {
          throw new Error(`redeem tx reverted: ${hash}`)
        }
      } catch (e) {
        console.error(e)
      } finally {
        isWithdrawing = false
        updateBalances()
      }
    }
  }
</script>

{#if !$walletClient || !$userAddress || !amount}
  <button class="teal-button" disabled={true}>Withdraw</button>
{:else}
  <button type="submit" on:click={withdraw} class="teal-button" disabled={isWithdrawing || disabled}>Withdraw</button>
{/if}
