<script>
  import { appName, pageTransition, prizePool, twabRewardsTokenOptions } from '$lib/config'
  import { getPrizeDistribution, getPromotionInfo, getTokenPrice } from '$lib/utils'
  import { prizeDistribution, promotionInfo } from '$lib/stores'
  import { QueryClientProvider } from '@tanstack/react-query'
  import { RainbowKitProvider } from '@rainbow-me/rainbowkit'
  import { queryClient, wagmiConfig } from '$lib/constants'
  import { used } from 'svelte-preprocess-react'
  import { fade } from 'svelte/transition'
  import { WagmiProvider } from 'wagmi'
  import { page } from '$app/stores'
  import { onMount } from 'svelte'
  import Nav from '$lib/components/Nav.svelte'
  import '@rainbow-me/rainbowkit/styles.css'
  import '../app.css'

  export let data

  $: currentPage = $page.url.pathname.split('/')[1]
  $: pageTitle = currentPage.slice(0, 1).toUpperCase() + currentPage.slice(1)
  $: title = appName + (!!pageTitle ? ` | ${pageTitle}` : '')

  used(WagmiProvider)
  used(QueryClientProvider)
  used(RainbowKitProvider)

  onMount(async () => {
    await getTokenPrice(prizePool.prizeToken)
    await getPrizeDistribution().then(prizeDistribution.set)
    await getPromotionInfo().then(promotionInfo.set)

    for (const token of twabRewardsTokenOptions) {
      await getTokenPrice(token)
    }
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
        <main
          in:fade={{ duration: pageTransition.duration, delay: pageTransition.duration }}
          out:fade={{ duration: pageTransition.duration }}
        >
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
