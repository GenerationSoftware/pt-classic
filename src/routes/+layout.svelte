<script>
  import { appName, pageTransition } from '$lib/config'
  import { fade } from 'svelte/transition'
  import { page } from '$app/stores'
  import Nav from '$lib/components/Nav.svelte'
  import '../app.css'

  export let data

  $: currentPage = $page.url.pathname.split('/')[1]
  $: pageTitle = currentPage.slice(0, 1).toUpperCase() + currentPage.slice(1)
  $: title = appName + (!!pageTitle ? ` | ${pageTitle}` : '')
</script>

<svelte:head>
  <title>{title}</title>
</svelte:head>

<Nav />

{#key data.pathname}
  <main in:fade={{ duration: pageTransition.duration, delay: pageTransition.duration }} out:fade={{ duration: pageTransition.duration }}>
    <slot />
  </main>
{/key}

<style>
  main {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
  }
</style>
