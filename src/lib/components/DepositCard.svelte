<script lang="ts">
  import { formatUnits, parseUnits } from 'viem'
  import { userAddress, userBalances } from '$lib/stores'
  import { prizeVault } from '$lib/config'
  import { lower } from '$lib/utils'
  import DepositButton from './DepositButton.svelte'

  let formInput: string
  let error: string = ''

  // TODO: this should allow for zapping anything in the user's wallet

  $: assetBalance = $userBalances[lower(prizeVault.asset.address)]

  const getErrorMsg = () => {
    if (!!formInput && assetBalance !== undefined) {
      if (Number.isNaN(Number(formInput))) {
        error = 'Enter a valid number'
      } else if (parseFloat(formInput) < 0) {
        error = 'Enter a valid positive number'
      } else if (formInput.split('.')[1]?.length > prizeVault.asset.decimals) {
        error = 'Too many decimals'
      } else if (parseFloat(formatUnits(assetBalance, prizeVault.asset.decimals)) < parseFloat(formInput)) {
        error = `Not enough ${prizeVault.asset.symbol} in wallet`
      } else {
        error = ''
      }
    } else if (!!formInput && !$userAddress) {
      error = 'Connect your wallet to deposit'
    } else {
      error = ''
    }
  }

  $: formInput, assetBalance, $userAddress, getErrorMsg()

  $: amount = !!formInput && assetBalance !== undefined && !error ? parseUnits(formInput, prizeVault.asset.decimals) : 0n
</script>

<div class="card">
  <span>How much do you want to deposit?</span>
  <input bind:value={formInput} placeholder={`Enter a $ amount...`} />
  <span>{error}</span>
  <DepositButton {amount} onSuccess={() => (formInput = '')} disabled={!!error} />
</div>

<style>
  div.card {
    display: flex;
    flex-direction: column;
  }
</style>
