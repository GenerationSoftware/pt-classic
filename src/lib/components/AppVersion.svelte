<script>
  import { version } from '$app/environment'
  import { userAddress } from '$lib/stores'

  $: formattedVersion = `v${version}`
</script>

<span class:lower={!$userAddress}>{formattedVersion}</span>

<style>
  span {
    position: fixed;
    bottom: 5.5rem;
    left: 1rem;
    color: rgba(245, 240, 255, 0.2);
  }

  span.lower {
    bottom: 0.5rem;
  }

  @media (min-width: 48rem) {
    span {
      bottom: 0.5rem;
    }
  }
</style>
