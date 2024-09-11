<script lang="ts">
  export let onClick: () => void
</script>

<button on:click={onClick}>
  <svg width="17" height="16" viewBox="0 0 17 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M2.5 8.00004H14.5H2.5Z" fill="#DECEFF" />
    <path
      d="M7.16667 12.6667L2.5 8.00004M2.5 8.00004L7.16667 3.33337M2.5 8.00004H14.5"
      stroke="#DECEFF"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </svg>
  <span>Back</span>
</button>

<style>
  button {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 0.5rem;
  }

  span {
    color: var(--pt-purple-100);
    font-size: 0.75rem;
    font-weight: 500;
  }
</style>
