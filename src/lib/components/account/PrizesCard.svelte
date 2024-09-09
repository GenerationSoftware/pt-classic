<script lang="ts">
  import { isFetchedUserFlashEvents, userFlashEvents } from '$lib/stores'
  import { formatPrize, getBlockTimestamp } from '$lib/utils'
  import Loading from '../Loading.svelte'

  let isExpanded = false

  $: prizesWon = $userFlashEvents.map((flashEvent) => formatPrize(flashEvent))

  // TODO: also include bonus rewards (show underlying tokens on hover or click)
  $: rows = [...prizesWon]

  const getBlockDate = async (blockNumber: bigint) => {
    return new Date((await getBlockTimestamp(blockNumber)) * 1e3).toLocaleDateString('en', { day: '2-digit', month: '2-digit' })
  }
</script>

<div class="card">
  <div class="banner">
    <span class="img-wrapper" />
    <span class="title">Prizes</span>
  </div>
  <div class="content-wrapper">
    <div class="rows">
      {#if !$isFetchedUserFlashEvents}
        <Loading height="1rem" />
      {:else if !rows.length}
        <span>No prizes... yet</span>
      {:else}
        {#each prizesWon.slice(0, isExpanded ? undefined : 3) as prize}
          <div class="prize-row">
            <div class="prize-info">
              {#await getBlockDate(prize.blockNumber)}
                <Loading height="1rem" />
              {:then date}
                <!-- TODO: need a monospace font for this -->
                <span>{date}</span>
              {/await}
              <span>•</span>
              <span>Prize</span>
            </div>
            <span class="prize-amount">+${prize.formattedAmount}</span>
          </div>
        {/each}
      {/if}
    </div>
    {#if rows.length > 3 && !isExpanded}
      <button class="expand" on:click={() => (isExpanded = true)}>See More</button>
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

  div.rows {
    max-height: 10rem;
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
    margin-bottom: 0.5rem;
    overflow-y: auto;
  }

  div.prize-row {
    display: flex;
    justify-content: space-between;
    gap: 1rem;
  }

  div.prize-info > span:first-child {
    color: var(--pt-purple-200);
  }

  button.expand {
    color: var(--pt-purple-400);
    font-size: 0.75rem;
  }
</style>
