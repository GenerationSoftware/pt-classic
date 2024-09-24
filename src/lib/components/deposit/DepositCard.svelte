<script lang="ts">
  import { userAddress, userBalances, userPrizeHookStatus } from '$lib/stores'
  import { formatShareAmount, lower } from '$lib/utils'
  import { formatUnits, parseUnits } from 'viem'
  import { prizeVault, zap } from '$lib/config'
  import type { Token } from '$lib/types'
  import ConfigModalContent from '../account/ConfigModalContent.svelte'
  import ConfigModalBanner from '../account/ConfigModalBanner.svelte'
  import DepositZapButton from './DepositZapButton.svelte'
  import DepositButton from './DepositButton.svelte'
  import SuccessPooly from '../SuccessPooly.svelte'
  import BackButton from '../BackButton.svelte'
  import Loading from '../Loading.svelte'
  import Modal from '../Modal.svelte'

  const tokenOptions: Token[] = [prizeVault.asset, ...zap.tokenOptions]
  let tokenOptionIndex: number = 0
  let formInput: string
  let error: string = ''
  let successfullyDepositedAmount: bigint = 0n

  $: token = tokenOptions[tokenOptionIndex]

  $: assetBalance = $userBalances[lower(token.address)] as bigint | undefined
  $: flooredAssetBalance =
    Math.floor(parseFloat(formatUnits(assetBalance ?? 0n, token.decimals)) * 10 ** token.decimals) / 10 ** token.decimals
  $: formattedAssetBalance = flooredAssetBalance.toLocaleString('en', {
    minimumFractionDigits: 2,
    maximumFractionDigits: token.decimals <= 6 ? 2 : 4
  })

  $: isZapping = lower(token.address) !== lower(prizeVault.asset.address)

  const getErrorMsg = () => {
    if (!!formInput && assetBalance !== undefined) {
      if (Number.isNaN(Number(formInput))) {
        error = 'Enter a valid number'
      } else if (parseFloat(formInput) < 0) {
        error = 'Enter a valid positive number'
      } else if (formInput.split('.')[1]?.length > token.decimals) {
        error = 'Too many decimals'
      } else if (parseFloat(formatUnits(assetBalance, token.decimals)) < parseFloat(formInput)) {
        error = `Not enough ${token.symbol} in wallet`
      } else {
        error = ''
      }
    } else {
      error = ''
    }
  }

  $: formInput, assetBalance, $userAddress, getErrorMsg()

  $: amount = !!formInput && assetBalance !== undefined && !error ? parseUnits(formInput, token.decimals) : 0n

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
          {!isZapping ? '$' : ''}
          <input bind:value={formInput} placeholder="0.00" style:width={`${getInputChars(formInput || '0.00')}ch`} />
          {isZapping ? token.symbol : ''}
        </label>
        {#if $userAddress}
          <span>of {!isZapping ? '$' : ''}{formattedAssetBalance} {isZapping ? token.symbol : ''} available</span>
        {/if}
      {:else}
        <Loading height="1rem" />
      {/if}
    </div>
    {#if tokenOptions.length > 1}
      {@const nextTokenOptionIndex = tokenOptionIndex === tokenOptions.length - 1 ? 0 : tokenOptionIndex + 1}

      <div class="switch-token">
        <button type="button" on:click={() => (tokenOptionIndex = nextTokenOptionIndex)}>
          <em>Deposit {tokenOptions[nextTokenOptionIndex].symbol} instead</em>
        </button>
        <Modal title="Zapping" buttonStyle="height: .9rem;">
          <svg slot="button-content" height=".875rem" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              fill-rule="evenodd"
              d="M24 12.5C24 15.6826 22.7357 18.7348 20.4853 20.9853C18.2348 23.2357 15.1826 24.5 12 24.5C8.8174 24.5 5.76516 23.2357 3.51472 20.9853C1.26428 18.7348 0 15.6826 0 12.5C0 9.3174 1.26428 6.26516 3.51472 4.01472C5.76516 1.76428 8.8174 0.5 12 0.5C15.1826 0.5 18.2348 1.76428 20.4853 4.01472C22.7357 6.26516 24 9.3174 24 12.5ZM12 8C11.7364 7.99974 11.4775 8.06893 11.2492 8.2006C11.0209 8.33226 10.8313 8.52176 10.6995 8.75C10.6043 8.92681 10.4747 9.08273 10.3181 9.20849C10.1616 9.33426 9.98143 9.42731 9.78828 9.48215C9.59512 9.53699 9.39292 9.55249 9.19366 9.52773C8.9944 9.50297 8.80214 9.43846 8.62828 9.33802C8.45441 9.23758 8.30248 9.10325 8.1815 8.943C8.06051 8.78275 7.97293 8.59985 7.92394 8.40512C7.87496 8.2104 7.86556 8.00782 7.89632 7.8094C7.92708 7.61098 7.99736 7.42075 8.103 7.25C8.59833 6.39217 9.36286 5.72174 10.278 5.34269C11.1932 4.96364 12.2079 4.89716 13.1647 5.15354C14.1215 5.40992 14.967 5.97484 15.57 6.7607C16.1731 7.54656 16.5 8.50943 16.5 9.5C16.5003 10.4309 16.2119 11.339 15.6746 12.0993C15.1374 12.8595 14.3776 13.4345 13.5 13.745V14C13.5 14.3978 13.342 14.7794 13.0607 15.0607C12.7794 15.342 12.3978 15.5 12 15.5C11.6022 15.5 11.2206 15.342 10.9393 15.0607C10.658 14.7794 10.5 14.3978 10.5 14V12.5C10.5 12.1022 10.658 11.7206 10.9393 11.4393C11.2206 11.158 11.6022 11 12 11C12.3978 11 12.7794 10.842 13.0607 10.5607C13.342 10.2794 13.5 9.89782 13.5 9.5C13.5 9.10218 13.342 8.72064 13.0607 8.43934C12.7794 8.15804 12.3978 8 12 8ZM12 20C12.3978 20 12.7794 19.842 13.0607 19.5607C13.342 19.2794 13.5 18.8978 13.5 18.5C13.5 18.1022 13.342 17.7206 13.0607 17.4393C12.7794 17.158 12.3978 17 12 17C11.6022 17 11.2206 17.158 10.9393 17.4393C10.658 17.7206 10.5 18.1022 10.5 18.5C10.5 18.8978 10.658 19.2794 10.9393 19.5607C11.2206 19.842 11.6022 20 12 20Z"
              fill="#C8ADFF"
            />
          </svg>
          <span slot="modal-content">
            If you choose to deposit any asset other than {prizeVault.asset.symbol}, your deposit will be automatically swapped to {prizeVault
              .asset.symbol} at the best rates we can find, and then deposited into PoolTogether in the same transaction.
          </span>
        </Modal>
      </div>
    {/if}
    <span class="error" class:wallet-connected={!!$userAddress}>{error}</span>
    {#if isZapping}
      <DepositZapButton {amount} {token} {onSuccess} disabled={!!error} />
    {:else}
      <DepositButton {amount} {onSuccess} disabled={!!error} />
    {/if}
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
    width: min(calc(100% - 2rem - (2 * var(--padding))), calc(32rem - (2 * var(--padding))));
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
    margin: 3rem 0 0.5rem;
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

  div.switch-token {
    display: flex;
    justify-content: end;
    align-items: center;
    gap: 1ch;
    padding-right: 0.5rem;
    font-size: 0.75rem;
  }

  div.switch-token em {
    color: var(--pt-purple-100);
  }

  div.switch-token span {
    font-size: 0.875rem;
    color: var(--pt-purple-100);
  }

  span.error {
    height: 1rem;
    margin-top: 1.5rem;
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
