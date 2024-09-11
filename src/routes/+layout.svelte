<script>
  import { getPrizeDistribution, getTokenPrice } from '$lib/utils'
  import { QueryClientProvider } from '@tanstack/react-query'
  import { RainbowKitProvider } from '@rainbow-me/rainbowkit'
  import { queryClient, wagmiConfig } from '$lib/constants'
  import { appName, prizePool } from '$lib/config'
  import { prizeDistribution } from '$lib/stores'
  import { used } from 'svelte-preprocess-react'
  import { fade } from 'svelte/transition'
  import { WagmiProvider } from 'wagmi'
  import { page } from '$app/stores'
  import { onMount } from 'svelte'
  import Nav from '$lib/components/Nav.svelte'
  import '@rainbow-me/rainbowkit/styles.css'
  import '../app.css'

  export let data
  const transitionDuration = 100

  $: currentPage = $page.url.pathname.split('/')[1]
  $: pageTitle = currentPage.slice(0, 1).toUpperCase() + currentPage.slice(1)
  $: title = appName + (!!pageTitle ? ` | ${pageTitle}` : '')

  used(WagmiProvider)
  used(QueryClientProvider)
  used(RainbowKitProvider)

  onMount(async () => {
    getTokenPrice(prizePool.prizeToken)
    getPrizeDistribution().then(prizeDistribution.set)
  })
</script>

<svelte:head>
  <title>{title}</title>
</svelte:head>

<react:WagmiProvider config={wagmiConfig}>
  <react:QueryClientProvider client={queryClient}>
    <react:RainbowKitProvider>
      <Nav />

      {#key data.pathname}
        <main in:fade={{ duration: transitionDuration, delay: transitionDuration }} out:fade={{ duration: transitionDuration }}>
          <slot />
        </main>
      {/key}
    </react:RainbowKitProvider>
  </react:QueryClientProvider>
</react:WagmiProvider>

<style>
  main {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
  }
</style>
