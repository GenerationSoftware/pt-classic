<script lang="ts">
  import { userAddress, userBalances } from '$lib/stores'
  import { formatShareAmount, lower } from '$lib/utils'
  import { formatUnits, parseUnits } from 'viem'
  import { prizeVault } from '$lib/config'
  import WithdrawButton from './WithdrawButton.svelte'
  import Loading from '../Loading.svelte'

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

  const getInputChars = (value: string) => {
    return value.split('').reduce((a, b) => a + (b === '.' || b === ',' ? 0.5 : 1), 0)
  }
</script>

<div class="card">
  <span>How much do you want to withdraw?</span>
  <div class="input">
    {#if vaultBalance !== undefined}
      <label class:placeholder-color={!formInput}>
        $<input bind:value={formInput} placeholder="0.00" style={`width: ${getInputChars(formInput || '0.00')}ch`} />
      </label>
      <span>of ${formatShareAmount(vaultBalance)} available</span>
    {:else}
      <Loading height="1rem" />
    {/if}
  </div>
  <!-- TODO: style error message (avoid moving button) -->
  <span>{error}</span>
  <WithdrawButton {amount} onSuccess={() => (formInput = '')} disabled={!!error} />
</div>

<style>
  div.card {
    --padding: 1.5rem;
    width: calc(100% - 2rem - calc(2 * var(--padding)));
    display: flex;
    flex-direction: column;
    padding: var(--padding);
    text-align: center;
    background-color: var(--pt-purple-700);
    border-radius: 1.5rem;
    overflow: hidden;
  }

  div.input {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
    margin: 3rem 0;
    padding: 1rem 0.75rem;
    background-color: var(--pt-transparent);
    border-radius: 1rem;
    border: 1px solid var(--pt-transparent);
  }

  div.input > label {
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 1.5rem;
    font-weight: 600;
    line-height: 150%;
  }

  div.input > label.placeholder-color {
    color: var(--pt-placeholder);
  }

  div.input input {
    position: relative;
    color: inherit;
    font: inherit;
    background-color: transparent;
    border: none;
    outline: none;
  }

  div.input > span {
    color: var(--pt-purple-200);
  }
</style>
