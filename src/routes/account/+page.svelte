<script>
  import { userAddress } from '$lib/stores'
  import AccountBalance from '$lib/components/account/AccountBalance.svelte'
  import AccountActions from '$lib/components/account/AccountActions.svelte'
  import AccountStats from '$lib/components/account/AccountStats.svelte'
  import PrizesCard from '$lib/components/account/PrizesCard.svelte'
</script>

<!-- TODO: need state for no wallets connected -->
{#if $userAddress}
  <AccountBalance />
  <AccountStats />
  <PrizesCard />
  <AccountActions />
{/if}
