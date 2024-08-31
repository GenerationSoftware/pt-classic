<script>
  import { goto } from '$app/navigation'
  import { onMount } from 'svelte'

  // TODO: if user has a wallet connected, go to account page instead
  onMount(() => goto('/deposit'))
</script>
