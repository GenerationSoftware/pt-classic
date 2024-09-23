<script lang="ts">
  import { redeem, updateUserTokenBalances, updateUserTransferEvents } from '$lib/utils'
  import { clients, userAddress, userTransferEvents } from '$lib/stores'
  import { dolphinAddress } from '$lib/constants'
  import { prizeVault } from '$lib/config'
  import WalletConnectionModal from '../WalletConnectionModal.svelte'
  import Loading from '../Loading.svelte'

  export let amount: bigint
  export let disabled: boolean = false
  export let onSuccess: (amount: bigint) => void = () => {}
  let isWithdrawing: boolean = false
</script>

{#if !$clients.wallet || !$userAddress}
  <WalletConnectionModal>
    <div slot="button-content" class="teal-button">Connect Wallet</div>
  </WalletConnectionModal>
{:else if !amount}
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
          updateUserTransferEvents($userAddress, $userTransferEvents ?? [])
          onSuccess(withdrawEvent.args.assets)
        },
        onSettled: () => {
          isWithdrawing = false
          updateUserTokenBalances($userAddress, [dolphinAddress, prizeVault.address, prizeVault.asset.address])
        }
      })}
    class="teal-button"
    disabled={isWithdrawing || disabled}
  >
    {#if isWithdrawing}
      <Loading height=".75rem" />
    {:else}
      Withdraw
    {/if}
  </button>
{/if}
