<script>
  import { version } from '$app/environment'

  $: formattedVersion = `v${version}`
</script>

<span>{formattedVersion}</span>

<style>
  span {
    position: fixed;
    bottom: 5.5rem;
    left: 1rem;
    color: rgba(245, 240, 255, 0.2);
  }

  @media (min-width: 48rem) {
    span {
      bottom: 0.5rem;
    }
  }
</style>
