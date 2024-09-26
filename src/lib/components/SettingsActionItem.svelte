<script lang="ts">
  export let action: () => void
  export let disabledReason: string = ''
  export let disabled: boolean
</script>

<div>
  <button on:click={action} {disabled}>
    <slot />
  </button>
  {#if disabled && !!disabledReason}
    <em>{disabledReason}</em>
  {/if}
</div>

<style>
  div {
    display: flex;
    flex-direction: column;
    gap: 0.125rem;
  }

  button {
    padding: 0.5rem 0.75rem;
    font-size: 0.75rem;
    color: var(--pt-purple-100);
    background-color: var(--pt-transparent);
    border: 1px solid var(--pt-transparent);
    border-radius: 0.5rem;
  }

  button:hover {
    background-color: rgba(245, 240, 255, 0.15);
  }

  em {
    font-size: 0.75rem;
    color: var(--pt-purple-100);
  }
</style>
