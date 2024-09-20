<script lang="ts">
  import { approve, deposit, updateUserTokenBalances, updateUserTransferEvents } from '$lib/utils'
  import { clients, userAddress, userTransferEvents } from '$lib/stores'
  import { dolphinAddress } from '$lib/constants'
  import { prizeVault } from '$lib/config'
  import { erc20Abi } from 'viem'
  import WalletConnectionModalContent from '../WalletConnectionModalContent.svelte'
  import Modal from '../Modal.svelte'

  export let amount: bigint
  export let disabled: boolean = false
  export let onSuccess: (amount: bigint) => void = () => {}
  let allowance: bigint | undefined = undefined
  let isApproving: boolean = false
  let isDepositing: boolean = false
  let closeWalletConnectionModal: () => void

  const updateAllowance = async () => {
    if (!!$userAddress) {
      allowance = await $clients.public.readContract({
        address: prizeVault.asset.address,
        abi: erc20Abi,
        functionName: 'allowance',
        args: [$userAddress, prizeVault.address]
      })
    }
  }

  $: $userAddress, updateAllowance()
</script>

{#if !$clients.wallet || !$userAddress}
  <Modal title="Wallets" bind:close={closeWalletConnectionModal}>
    <div slot="button-content" class="teal-button">Connect Wallet</div>
    <WalletConnectionModalContent slot="modal-content" onConnected={closeWalletConnectionModal} />
  </Modal>
{:else if !amount || allowance === undefined}
  <button class="teal-button" disabled={true}>Deposit</button>
{:else if allowance < amount}
  <button
    type="submit"
    on:click={() =>
      approve(prizeVault.asset.address, prizeVault.address, amount, {
        onSend: () => {
          isApproving = true
        },
        onSettled: () => {
          isApproving = false
          updateAllowance()
        }
      })}
    class="teal-button"
    disabled={isApproving || disabled}>Approve</button
  >
{:else}
  <button
    type="submit"
    on:click={() =>
      deposit(amount, {
        onSend: () => {
          isDepositing = true
        },
        onSuccess: (_t, depositEvent) => {
          updateUserTransferEvents($userAddress, $userTransferEvents ?? [])
          onSuccess(depositEvent.args.assets)
        },
        onSettled: () => {
          isDepositing = false
          updateAllowance()
          updateUserTokenBalances($userAddress, [dolphinAddress, prizeVault.address, prizeVault.asset.address])
        }
      })}
    class="teal-button"
    disabled={isDepositing || disabled}>Deposit</button
  >
{/if}
