<script>
  import { userBalances } from '$lib/stores'
  import { prizeVault } from '$lib/config'
  import { formatUnits } from 'viem'
  import { lower } from '$lib/utils'
  import Loading from './Loading.svelte'

  $: vaultBalance = $userBalances[lower(prizeVault.address)]
  $: formattedVaultBalance =
    vaultBalance !== undefined
      ? parseFloat(formatUnits(vaultBalance, prizeVault.decimals)).toLocaleString('en', { maximumFractionDigits: 2 })
      : ''
</script>

<div>
  <span>Total Saved</span>
  {#if vaultBalance !== undefined}
    ${formattedVaultBalance}
  {:else}
    <Loading />
  {/if}
</div>

<style>
  div {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
</style>
