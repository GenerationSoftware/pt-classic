<script lang="ts">
  import { redeem, updateUserTokenBalances, updateUserTransferEvents } from '$lib/utils'
  import { clients, userAddress, userTransferEvents } from '$lib/stores'
  import { dolphinAddress } from '$lib/constants'
  import { prizeVault } from '$lib/config'
  import WalletConnectionModalContent from '../WalletConnectionModalContent.svelte'
  import Modal from '../Modal.svelte'

  export let amount: bigint
  export let disabled: boolean = false
  export let onSuccess: (amount: bigint) => void = () => {}
  let isWithdrawing: boolean = false
  let closeWalletConnectionModal: () => void
</script>

{#if !$clients.wallet || !$userAddress}
  <Modal title="Wallets" bind:close={closeWalletConnectionModal}>
    <div slot="button-content" class="teal-button">Connect Wallet</div>
    <WalletConnectionModalContent slot="modal-content" onConnected={closeWalletConnectionModal} />
  </Modal>
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
    disabled={isWithdrawing || disabled}>Withdraw</button
  >
{/if}
