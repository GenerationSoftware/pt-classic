<script>
  import { appName } from '$lib/config'
  import { page } from '$app/stores'
  import Nav from '$lib/components/Nav.svelte'
  import '../app.css'

  $: currentPage = $page.url.pathname.split('/')[1]
  $: pageTitle = currentPage.slice(0, 1).toUpperCase() + currentPage.slice(1)
  $: title = appName + (!!pageTitle ? ` | ${pageTitle}` : '')
</script>

<svelte:head>
  <title>{title}</title>
</svelte:head>

<Nav />

<main>
  <slot />
</main>

<style>
  main {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
  }
</style>
