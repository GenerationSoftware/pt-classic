<script lang="ts">
  import {
    tokenPrices,
    userAddress,
    userClaimedPrizeEvents,
    userClaimedRewards,
    userFlashEvents,
    userLastCheckedBlockNumber
  } from '$lib/stores'
  import { formatClaimedReward, formatFallbackPrize, formatPrize, getBlockDate } from '$lib/utils'
  import PrizeDetailsModal from './PrizeDetailsModal.svelte'
  import Loading from '../Loading.svelte'

  let isExpanded = false

  $: prizesWon = $userFlashEvents?.map(formatPrize) ?? []
  $: checkedPrizesWon = prizesWon.filter(
    (prize) => $userLastCheckedBlockNumber !== undefined && prize.blockNumber <= $userLastCheckedBlockNumber
  )

  $: fallbackPrizesWon =
    $userClaimedPrizeEvents
      ?.filter((e) => !!BigInt(e.args.payout))
      .map((claimedPrizeEvent) => formatFallbackPrize(claimedPrizeEvent, $tokenPrices)) ?? []
  $: checkedFallbackPrizesWon = fallbackPrizesWon.filter(
    (fallbackPrize) => $userLastCheckedBlockNumber !== undefined && fallbackPrize.blockNumber <= $userLastCheckedBlockNumber
  )

  $: rewardsClaimed = $userClaimedRewards?.map((claimedReward) => formatClaimedReward(claimedReward, $tokenPrices)) ?? []

  $: rows = [...checkedPrizesWon, ...checkedFallbackPrizesWon, ...rewardsClaimed].sort((a, b) => {
    const x = b.blockNumber - a.blockNumber
    return x === 0n ? 0 : x > 0n ? 1 : -1
  })
</script>

<div class="card">
  <div class="banner">
    <span class="img-wrapper" />
    <span class="title">Prizes</span>
  </div>
  <div class="content-wrapper">
    <div class="rows">
      {#if !$userAddress}
        <!-- TODO: allow clicking "connect your wallet" to connect -->
        <span>Connect your wallet to continue...</span>
      {:else if !$userFlashEvents || !$userClaimedPrizeEvents || !$userClaimedRewards}
        <Loading height=".75rem" />
      {:else if !rows.length}
        <span>No prizes... yet</span>
      {:else}
        {#each rows.slice(0, isExpanded ? undefined : 3) as row}
          <div class="row">
            <div class="row-info">
              {#await getBlockDate(row.blockNumber)}
                <Loading height=".75rem" />
              {:then date}
                <span class="monospace">{date}</span>
              {/await}
              <span>•</span>
              <span>{row.type === 'bonusReward' ? 'Bonus Reward' : 'Prize'}</span>
            </div>
            {#if row.type === 'fallbackPrize' || row.type === 'bonusReward'}
              {#if row.token.price !== undefined}
                <PrizeDetailsModal prize={row}>
                  <span slot="button-content" class="value-with-underlying">+${row.formattedAmount}</span>
                </PrizeDetailsModal>
              {:else}
                <Loading height=".75rem" />
              {/if}
            {:else}
              <span>+${row.formattedAmount}</span>
            {/if}
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
    width: min(calc(100% - 2rem), 32rem);
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
    background-image: url('/abstract-pooly.jpg');
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

  div.row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 1rem;
  }

  div.row-info > span:first-child {
    color: var(--pt-purple-200);
  }

  span.value-with-underlying {
    text-decoration: var(--pt-teal-light) wavy underline;
  }

  button.expand {
    color: var(--pt-purple-400);
    font-size: 0.75rem;
  }

  @media (min-width: 48rem) {
    div.banner {
      width: 30rem;
    }

    div.banner > span.img-wrapper {
      padding-top: 14rem;
    }
  }
</style>
