<script lang="ts">
  import { userAddress, userBalances } from '$lib/stores'
  import { formatShareAmount, lower } from '$lib/utils'
  import { formatUnits, parseUnits } from 'viem'
  import { prizeVault } from '$lib/config'
  import WithdrawButton from './WithdrawButton.svelte'
  import SuccessPooly from '../SuccessPooly.svelte'
  import BackButton from '../BackButton.svelte'
  import Loading from '../Loading.svelte'

  let formInput: string
  let error: string = ''
  let successfullyWithdrawnAmount: bigint = 0n

  $: vaultBalance = $userBalances[lower(prizeVault.address)] as bigint | undefined
  $: flooredVaultBalance = Math.floor(parseFloat(formatUnits(vaultBalance ?? 0n, prizeVault.decimals)) * 100) / 100
  $: formattedVaultBalance = flooredVaultBalance.toLocaleString('en', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

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

  const onSuccess = (withdrawnAmount: bigint) => {
    successfullyWithdrawnAmount = withdrawnAmount
    formInput = ''
  }
</script>

<div class="card">
  {#if !successfullyWithdrawnAmount}
    <span>How much do you want to withdraw?</span>
    <div class="input">
      {#if !$userAddress || vaultBalance !== undefined}
        <label class:placeholder-color={!formInput}>
          $<input bind:value={formInput} placeholder="0.00" style={`width: ${getInputChars(formInput || '0.00')}ch`} />
        </label>
        <span>of ${formattedVaultBalance} available</span>
      {:else}
        <Loading height="1rem" />
      {/if}
    </div>
    <span class="error">{error}</span>
    <WithdrawButton {amount} {onSuccess} disabled={!!error} />
  {:else}
    <h3 class="success-title">Success!</h3>
    <span class="success-info">You withdrew {formatShareAmount(successfullyWithdrawnAmount)} {prizeVault.asset.symbol}</span>
    <SuccessPooly style="max-height: 7.5rem; margin: 2rem 0;" />
    <BackButton onClick={() => (successfullyWithdrawnAmount = 0n)} />
  {/if}
</div>

<style>
  div.card {
    --padding: 1.5rem;
    width: calc(100% - 2rem - (2 * var(--padding)));
    display: flex;
    flex-direction: column;
    padding: var(--padding);
    text-align: center;
    background-color: var(--pt-purple-700);
    border-radius: 1.5rem;
    overflow: hidden;
  }

  div.input {
    min-height: 4rem;
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 0.25rem;
    margin: 3rem 0 2rem;
    padding: 1rem 0.75rem;
    background-color: var(--pt-transparent);
    border: 1px solid var(--pt-transparent);
    border-radius: 1rem;
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

  span.error {
    height: 1rem;
    color: var(--pt-warning-light);
    font-size: 0.8rem;
  }

  h3.success-title {
    color: var(--pt-teal-dark);
    font-size: 1.75rem;
    font-weight: 700;
    line-height: 150%;
  }

  span.success-info {
    color: var(--pt-purple-100);
    font-size: 1.25rem;
    font-weight: 600;
    line-height: 150%;
  }
</style>
