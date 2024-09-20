<script lang="ts">
  import { userAddress, userBalances, userPrizeHookStatus } from '$lib/stores'
  import { formatShareAmount, lower } from '$lib/utils'
  import { formatUnits, parseUnits } from 'viem'
  import { prizeVault } from '$lib/config'
  import ConfigModalContent from '../account/ConfigModalContent.svelte'
  import ConfigModalBanner from '../account/ConfigModalBanner.svelte'
  import DepositButton from './DepositButton.svelte'
  import SuccessPooly from '../SuccessPooly.svelte'
  import BackButton from '../BackButton.svelte'
  import Loading from '../Loading.svelte'
  import Modal from '../Modal.svelte'

  let formInput: string
  let error: string = ''
  let successfullyDepositedAmount: bigint = 0n

  // TODO: this should allow for zapping anything in the user's wallet

  $: assetBalance = $userBalances[lower(prizeVault.asset.address)] as bigint | undefined
  $: flooredAssetBalance = Math.floor(parseFloat(formatUnits(assetBalance ?? 0n, prizeVault.decimals)) * 100) / 100
  $: formattedAssetBalance = flooredAssetBalance.toLocaleString('en', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

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
    } else {
      error = ''
    }
  }

  $: formInput, assetBalance, $userAddress, getErrorMsg()

  $: amount = !!formInput && assetBalance !== undefined && !error ? parseUnits(formInput, prizeVault.asset.decimals) : 0n

  const getInputChars = (value: string) => {
    return value.split('').reduce((a, b) => a + (b === '.' || b === ',' ? 0.5 : 1), 0)
  }

  const onSuccess = (depositedAmount: bigint) => {
    successfullyDepositedAmount = depositedAmount
    formInput = ''
  }

  $: isAccountSetupNecessary = !!$userPrizeHookStatus && (!$userPrizeHookStatus.isPrizeHookSet || !$userPrizeHookStatus.isSwapperSet)
</script>

<div class="card">
  {#if !successfullyDepositedAmount}
    <span>How much do you want to deposit?</span>
    <div class="input" class:wallet-connected={!!$userAddress}>
      {#if !$userAddress || assetBalance !== undefined}
        <label class:placeholder-color={!formInput}>
          $<input bind:value={formInput} placeholder="0.00" style:width={`${getInputChars(formInput || '0.00')}ch`} />
        </label>
        {#if $userAddress}
          <span>of ${formattedAssetBalance} available</span>
        {/if}
      {:else}
        <Loading height="1rem" />
      {/if}
    </div>
    <span class="error" class:wallet-connected={!!$userAddress}>{error}</span>
    <DepositButton {amount} {onSuccess} disabled={!!error} />
  {:else}
    <h3 class="success-title">Success!</h3>
    <span class="success-info">You deposited {formatShareAmount(successfullyDepositedAmount)} {prizeVault.asset.symbol}</span>
    <SuccessPooly style="max-height: 7.5rem; margin: 2rem 0;" />
    {#if isAccountSetupNecessary}
      <Modal title="Account Setup">
        <div slot="button-content" class="account-setup-prompt">
          <ConfigModalBanner />
        </div>
        <ConfigModalContent slot="modal-content" />
      </Modal>
    {/if}
    <BackButton onClick={() => (successfullyDepositedAmount = 0n)} />
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

  div.input.wallet-connected {
    min-height: 4rem;
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
    opacity: 0;
  }

  span.error.wallet-connected {
    opacity: 1;
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

  div.account-setup-prompt {
    margin-bottom: 1rem;
  }
</style>
