<script>
  import { fly } from 'svelte/transition'
</script>

<!-- TODO: different animations for desktop -->
<div in:fly={{ x: -100 }} out:fly={{ x: 100 }}>Click here to finish setting up your account</div>

<style>
  div {
    padding: 1rem;
    color: var(--pt-teal-light);
    background-color: var(--pt-purple-600);
    border: 1px solid var(--pt-purple-400);
    border-radius: 0.5rem;
  }
</style>
