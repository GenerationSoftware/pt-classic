<script lang="ts">
  import { userAddress, userBalances, userTransferEvents, walletClient } from '$lib/stores'
  import { getTokenBalances, getTransferEvents, redeem } from '$lib/utils'
  import { prizeVault } from '$lib/config'

  export let amount: bigint
  export let disabled: boolean = false
  export let onSuccess: (amount: bigint) => void = () => {}
  let isWithdrawing: boolean = false

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
</script>

{#if !$walletClient || !$userAddress || !amount}
  <button class="teal-button" disabled={true}>Withdraw</button>
{:else}
  <button
    type="submit"
    on:click={() =>
      redeem(amount, {
        onSend: () => {
          isWithdrawing = true
        },
        onSuccess: (_t, withdrawEvent) => {
          updateTransferEvents()
          onSuccess(withdrawEvent.args.assets)
        },
        onSettled: () => {
          isWithdrawing = false
          updateBalances()
        }
      })}
    class="teal-button"
    disabled={isWithdrawing || disabled}>Withdraw</button
  >
{/if}
