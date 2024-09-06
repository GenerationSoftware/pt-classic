<script>
  import { userBalances } from '$lib/stores'
  import { prizeVault } from '$lib/config'
  import { formatUnits } from 'viem'
  import { lower } from '$lib/utils'
  import Loading from '../Loading.svelte'

  $: vaultBalance = $userBalances[lower(prizeVault.address)]
  $: formattedVaultBalance =
    vaultBalance !== undefined
      ? parseFloat(formatUnits(vaultBalance, prizeVault.decimals)).toLocaleString('en', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2
        })
      : ''
</script>

<div>
  <h2>Total Saved</h2>
  {#if vaultBalance !== undefined}
    <span>${formattedVaultBalance}</span>
  {:else}
    <Loading />
  {/if}
</div>

<style>
  div {
    width: calc(100% - 2rem);
    display: flex;
    flex-direction: column;
    align-items: center;
    margin: 1rem 0;
  }

  h2 {
    color: var(--pt-purple-200);
    line-height: 150%;
  }

  span {
    color: var(--pt-teal-dark);
    font-size: 1.75rem;
    font-weight: 700;
    line-height: 150%;
  }
</style>
