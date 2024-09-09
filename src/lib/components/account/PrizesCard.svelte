<script lang="ts">
  import Loading from '../Loading.svelte'

  // TODO: get rows based on prizes and bonus rewards received / claimed
  $: isFetchedData = true
  $: rows = []

  const onClickSeeMore = () => {
    // TODO: double rows and turn content scrollable
  }
</script>

<div class="card">
  <div class="banner">
    <span class="img-wrapper" />
    <span class="title">Prizes</span>
  </div>
  <div class="content-wrapper">
    {#if !isFetchedData}
      <Loading />
    {:else if !rows.length}
      <span style="margin-bottom: 0.5rem">No prizes... yet</span>
    {:else}
      {#each rows as row}
        <!-- TODO: show prizes won -->
        <!-- TODO: show claimed bonus rewards -->
        <span>ROW</span>
      {/each}
    {/if}
    {#if rows.length > 3}
      <button class="expand" on:click={onClickSeeMore}>See More</button>
    {/if}
  </div>
</div>

<style>
  div.card {
    width: calc(100% - 2rem);
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }

  div.banner {
    position: relative;
    display: flex;
    padding: 1rem;
    border-radius: 1rem 1rem 0 0;
    overflow: hidden;
    isolation: isolate;
  }

  div.banner > span.title {
    padding: 0.25rem 0.5rem;
    color: var(--pt-teal-dark);
    background-color: var(--pt-purple-700);
    font-size: 1.5rem;
    line-height: 150%;
    border-radius: 0.5rem;
  }

  div.banner > span.img-wrapper {
    position: absolute;
    inset: 0;
    padding-top: 42vw;
    background-image: url('/abstract-pooly.png');
    background-repeat: no-repeat;
    background-position-y: center;
    background-size: cover;
    z-index: -10;
  }

  div.banner > span.img-wrapper::after {
    content: '';
    position: absolute;
    inset: 0;
    background-color: rgba(126, 70, 242, 0.6);
  }

  div.content-wrapper {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
    padding: 1rem 1rem 0.5rem;
    text-align: center;
    color: var(--pt-teal-light);
    line-height: 150%;
    background-color: var(--pt-purple-700);
    border-radius: 0 0 1rem 1rem;
  }

  div.content-wrapper > button.expand {
    color: var(--pt-purple-400);
    font-size: 0.75rem;
  }
</style>
