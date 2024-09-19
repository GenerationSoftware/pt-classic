<script>
  import { userAddress, userBalances } from '$lib/stores'
  import { formatShareAmount, lower } from '$lib/utils'
  import { prizeVault } from '$lib/config'
  import Loading from '../Loading.svelte'

  // TODO: need to subtract unchecked prizes won
  $: vaultBalance = $userBalances[lower(prizeVault.address)]
  $: formattedVaultBalance = vaultBalance !== undefined ? formatShareAmount(vaultBalance) : '0.00'
</script>

<div>
  <h2>Total Saved</h2>
  {#if vaultBalance !== undefined}
    <span class="balance">${formattedVaultBalance}</span>
  {:else if !$userAddress}
    <span>-</span>
  {:else}
    <Loading height="1rem" style="margin: 0.8125rem 0;" />
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
    font-size: 1.75rem;
    font-weight: 700;
    line-height: 150%;
  }

  span.balance {
    color: var(--pt-teal-dark);
  }
</style>
