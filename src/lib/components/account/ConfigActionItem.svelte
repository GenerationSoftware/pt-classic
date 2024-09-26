<script lang="ts">
  import Loading from '../Loading.svelte'

  export let action: () => void
  export let isDone: boolean
  export let isDoing: boolean
</script>

<div>
  {#if !isDone}
    <button on:click={action} class="teal-button" disabled={isDoing}>
      {#if isDoing}
        <Loading height="1rem" />
      {:else}
        <slot name="name-not-done" />
        <svg height="1.5rem" width="1.5rem" viewBox="0 0 1000 1000" xmlns="http://www.w3.org/2000/svg">
          <glyph glyph-name="double-right" unicode="&#xea7c;" horiz-adv-x="1000" />
          <path
            d="M572.1 271.9l-64.70000000000005 64.70000000000005 163.30000000000007 163.29999999999995-163.30000000000007 163.20000000000005 64.70000000000005 64.69999999999993 227.89999999999998-227.89999999999998-227.89999999999998-228z m-372.1 64.70000000000005l163.3 163.29999999999995-163.3 163.20000000000005 64.69999999999999 64.69999999999993 227.90000000000003-227.89999999999998-227.90000000000003-228-64.69999999999999 64.70000000000005z"
          />
        </svg>
      {/if}
    </button>
  {:else}
    <button class="teal-button" disabled>
      <slot name="name-done" />
      <svg height="1rem" width="1rem" viewBox="0 0 1000 1000" xmlns="http://www.w3.org/2000/svg">
        <glyph glyph-name="ui-check" unicode="&#xec4b;" horiz-adv-x="1000" />
        <path
          d="M986 175.4l-153.60000000000002-124.10000000000001c-16.100000000000023-13-40-10.5-53.10000000000002 5.700000000000003l-419.19999999999993 519.2-164.20000000000002-149.20000000000005c-15.400000000000006-14.100000000000023-39.400000000000006-12.800000000000011-53.400000000000006 2.5l-132.7 146c-14.00000000000001 15.399999999999977-12.900000000000011 39.39999999999998 2.4999999999999893 53.39999999999998l351 319.1c15.399999999999977 14 38.599999999999966 12.200000000000045 51.69999999999999-4l123.79999999999995-154.39999999999998c0.20000000000004547-0.20000000000004547 0.20000000000004547-0.5 0.40000000000009095-0.8999999999999773l452.5-560.2c13-16.099999999999994 10.399999999999977-40.099999999999994-5.7000000000000455-53.099999999999994z"
        />
      </svg>
    </button>
  {/if}
  <p>
    <slot name="description" />
  </p>
</div>

<style>
  div {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  button {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 1ch;
  }

  p {
    text-align: left;
    font-size: 0.75rem;
  }
</style>
