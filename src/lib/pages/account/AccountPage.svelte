<script>
  import { userAddress } from '$lib/stores'
  import AccountBalance from '$lib/components/account/AccountBalance.svelte'
  import AccountActions from '$lib/components/account/AccountActions.svelte'
  import AccountStats from '$lib/components/account/AccountStats.svelte'
  import PrizesCard from '$lib/components/account/PrizesCard.svelte'
</script>

{#if $userAddress}
  <AccountBalance />
  <AccountStats />
  <PrizesCard />
  <AccountActions />
{/if}

{#if !$userAddress}
  <h1>Connect wallet!</h1>
{/if}
