<script>
  import { appName, pageTransition, prizeVault } from '$lib/config'
  import { getWalletProviders } from '$lib/utils'
  import { fade } from 'svelte/transition'
  import { goto } from '$app/navigation'
  import { page } from '$app/stores'
  import { onMount } from 'svelte'
  import AppVersion from '$lib/components/AppVersion.svelte'
  import Confetti from '$lib/components/Confetti.svelte'
  import Nav from '$lib/components/Nav.svelte'
  import '../app.css'

  export let data

  $: currentPage = $page.url.pathname.split('/')[1]
  $: pageTitle = currentPage.slice(0, 1).toUpperCase() + currentPage.slice(1)
  $: title = appName + (!!pageTitle ? ` | ${pageTitle}` : '')

  onMount(() => getWalletProviders({ onAutoConnect: () => goto('/account') }))
</script>

<svelte:head>
  <title>{title}</title>
  <meta name="description" content={`Save ${prizeVault.asset.symbol}, win prizes`} />
</svelte:head>

<Nav />

{#key data.pathname}
  <main in:fade={{ duration: pageTransition.duration, delay: pageTransition.duration }} out:fade={{ duration: pageTransition.duration }}>
    <slot />
  </main>
{/key}

<AppVersion />

<!-- import and call the `playConfetti` function anywhere in the app to play the confetti animation -->
<Confetti />

<style>
  main {
    max-width: 48rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
    margin: 2rem auto;
  }
</style>
