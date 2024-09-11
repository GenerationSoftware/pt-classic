<script lang="ts">
  import { userAddress, userBalances } from '$lib/stores'
  import { formatShareAmount, lower } from '$lib/utils'
  import { formatUnits, parseUnits } from 'viem'
  import { prizeVault } from '$lib/config'
  import WithdrawButton from './WithdrawButton.svelte'
  import BackButton from '../BackButton.svelte'
  import Loading from '../Loading.svelte'

  let formInput: string
  let error: string = ''
  let successfullyWithdrawnAmount: bigint = 0n

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

  const onSuccess = (_t: any, shares: bigint) => {
    successfullyWithdrawnAmount = shares
    formInput = ''
  }
</script>

<div class="card">
  {#if !successfullyWithdrawnAmount}
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
    <span class="error">{error}</span>
    <WithdrawButton {amount} {onSuccess} disabled={!!error} />
  {:else}
    <h3 class="success-title">Success!</h3>
    <span class="success-info">You withdrew {formatShareAmount(successfullyWithdrawnAmount)} {prizeVault.asset.symbol}</span>
    <svg class="success-pooly" viewBox="0 0 167 118" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        fill-rule="evenodd"
        d="M116.287 46.5489C116.283 46.5142 116.278 46.4795 116.274 46.4448C115.038 36.4054 105.897 29.2693 95.8572 30.5059C85.8178 31.7424 78.6816 40.8834 79.9182 50.9228C79.9225 50.9575 79.9268 50.9922 79.9313 51.0268L116.287 46.5489Z"
        fill="#9B6AFF"
      />
      <path
        fill-rule="evenodd"
        d="M57.8803 39.9288C57.8654 39.9083 57.8504 39.8878 57.8353 39.8674C53.4923 33.9775 45.197 32.7235 39.3072 37.0665C33.4174 41.4095 32.1634 49.7048 36.5063 55.5946C36.5214 55.615 36.5365 55.6354 36.5517 55.6558L57.8803 39.9288Z"
        fill="#FFB636"
      />
      <circle cx="57.2921" cy="34.2369" r="3.10917" transform="rotate(-6.00833 57.2921 34.2369)" fill="#36147D" />
      <path
        fill-rule="evenodd"
        d="M54.1171 19.4606C54.0753 19.5216 54.0337 19.5827 53.9922 19.6441C42.0528 37.2843 46.6742 61.2632 64.3144 73.2026C81.9546 85.142 105.934 80.5205 117.873 62.8803C117.914 62.819 117.956 62.7576 117.997 62.6961L54.1171 19.4606Z"
        fill="#9B6AFF"
      />
      <circle cx="58.1058" cy="34.8956" r="3.84945" transform="rotate(-6.00833 58.1058 34.8956)" fill="#36147D" />
      <rect x="95.9927" y="65.696" width="6.66251" height="23.6889" transform="rotate(-42.6128 95.9927 65.696)" fill="#9B6AFF" />
      <path
        fill-rule="evenodd"
        d="M117.383 78.2207C117.353 78.1874 117.323 78.1542 117.292 78.1212C114.131 74.7254 109.092 74.2781 106.036 77.1222C102.98 79.9663 103.065 85.0247 106.225 88.4205C106.256 88.4536 106.287 88.4863 106.318 88.5188L117.383 78.2207Z"
        fill="#FFB636"
      />
      <rect x="154.728" y="61" width="4" height="19" rx="2" fill="#35F0D0" />
      <rect x="146.728" y="72" width="4" height="20" rx="2" transform="rotate(-90 146.728 72)" fill="#35F0D0" />
      <path d="M10.1836 13L14.1836 17L24.1836 7" stroke="#35F0D0" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" />
      <circle cx="4.88402" cy="92.1394" r="4.61205" fill="#D9D9D9" />
      <rect x="88.0205" y="107.604" width="10.3093" height="10.3093" rx="5.15465" fill="#35F0D0" />
      <rect width="6" height="6" rx="3" transform="matrix(1 0 0 -1 128.184 22)" fill="#FFB636" />
    </svg>
    <BackButton onClick={() => (successfullyWithdrawnAmount = 0n)} />
  {/if}
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
    margin: 3rem 0 2rem;
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

  svg.success-pooly {
    max-height: 7.5rem;
    margin: 2rem 0;
  }
</style>
