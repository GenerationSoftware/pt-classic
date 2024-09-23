<script lang="ts">
  import { fly } from 'svelte/transition'

  export let animate: boolean = false

  $: duration = animate ? undefined : 0
</script>

<div in:fly={{ x: -100, duration }} out:fly={{ x: 100, duration }}>Click here to finish setting up your account</div>

<style>
  div {
    padding: 1rem;
    color: var(--pt-teal-light);
    background-color: var(--pt-purple-600);
    border: 1px solid var(--pt-purple-400);
    border-radius: 0.5rem;
  }

  @media (min-width: 48rem) {
    div {
      width: 32rem;
    }
  }
</style>
