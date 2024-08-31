<script lang="ts">
  import { formatUnits, parseUnits } from 'viem'
  import { userAddress, userBalances } from '$lib/stores'
  import { prizeVault } from '$lib/config'
  import { lower } from '$lib/utils'
  import WithdrawButton from './WithdrawButton.svelte'

  let formInput: string
  let error: string = ''

  $: vaultBalance = $userBalances[lower(prizeVault.address)]

  const getErrorMsg = () => {
    if (!!formInput && vaultBalance !== undefined) {
      if (Number.isNaN(Number(formInput))) {
        error = 'Enter a valid number'
      } else if (parseFloat(formInput) < 0) {
        error = 'Enter a valid positive number'
      } else if (formInput.split('.')[1]?.length > prizeVault.decimals) {
        error = 'Too many decimals'
      } else if (parseFloat(formatUnits(vaultBalance, prizeVault.decimals)) < parseFloat(formInput)) {
        error = `Not enough ${prizeVault.symbol} to withdraw`
      } else {
        error = ''
      }
    } else if (!!formInput && !$userAddress) {
      error = 'Connect your wallet to withdraw'
    } else {
      error = ''
    }
  }

  $: formInput, vaultBalance, $userAddress, getErrorMsg()

  $: amount = !!formInput && vaultBalance !== undefined && !error ? parseUnits(formInput, prizeVault.decimals) : 0n
</script>

<div class="card">
  <span>How much do you want to withdraw?</span>
  <input bind:value={formInput} placeholder={`Enter a $ amount...`} />
  <span>{error}</span>
  <WithdrawButton {amount} onSuccess={() => (formInput = '')} disabled={!!error} />
</div>

<style>
  div.card {
    display: flex;
    flex-direction: column;
  }
</style>
