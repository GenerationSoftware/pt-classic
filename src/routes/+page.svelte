<script>
  import { onMount } from 'svelte'
  import { Route, router } from 'tinro'
  import DepositPage from '$lib/pages/DepositPage.svelte'
  import PrizesPage from '$lib/pages/PrizesPage.svelte'
  import WithdrawPage from '$lib/pages/WithdrawPage.svelte'
  import AccountPage from '$lib/pages/account/AccountPage.svelte'
  import AccountBonusPage from '$lib/pages/account/AccountBonusPage.svelte'
  import AccountPrizesPage from '$lib/pages/account/AccountPrizesPage.svelte'

  // TODO: if user has a wallet connected, go to account page instead
  onMount(() => router.goto('/deposit'))
</script>

<Route path="/deposit"><DepositPage /></Route>
<Route path="/prizes">
  <PrizesPage />
</Route>
<Route path="/withdraw">
  <WithdrawPage />
</Route>
<Route path="/account/*">
  <Route path="/">
    <AccountPage />
  </Route>
  <Route path="/bonus">
    <AccountBonusPage />
  </Route>
  <Route path="/prizes">
    <AccountPrizesPage />
  </Route>
</Route>
