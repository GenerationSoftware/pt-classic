<script>
  import { getTotalPrizeValueAvailable, lower } from '$lib/utils'
  import { prizeDistribution, tokenPrices } from '$lib/stores'
  import { fade } from 'svelte/transition'
  import { prizePool } from '$lib/config'
  import DepositCard from '$lib/components/deposit/DepositCard.svelte'
  import Loading from '$lib/components/Loading.svelte'

  $: prizeTokenPrice = $tokenPrices[lower(prizePool.prizeToken.address)]
  $: totalPrizeValueAvailable = getTotalPrizeValueAvailable($prizeDistribution ?? [], prizeTokenPrice ?? 0)
  $: formattedTotalPrizeValueAvailable = totalPrizeValueAvailable.toLocaleString('en', { maximumFractionDigits: 0 })
</script>

<div class="banner">
  <span class="img-wrapper" />
  <span class="title">
    {#if totalPrizeValueAvailable !== 0}
      <span in:fade>Save & win up to <strong>${formattedTotalPrizeValueAvailable}</strong></span>
    {:else}
      <Loading height="1rem" />
    {/if}
  </span>
</div>

<span class="pt-info">Participate in daily PoolTogether prize draws</span>

<DepositCard />

<span class="join-us">Join the thousands of people saving to win</span>

<style>
  div.banner {
    position: relative;
    width: calc(100% - 4rem);
    display: flex;
    justify-content: center;
    text-align: center;
    padding: 1rem;
    border-radius: 1rem;
    overflow: hidden;
    isolation: isolate;
  }

  div.banner > span.title {
    padding: 0.25rem 0;
    font-size: 1.6rem;
    font-weight: 700;
  }

  div.banner > span.title strong {
    color: var(--pt-pink-light);
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
    background-color: rgba(69, 35, 139, 0.8);
  }

  span.pt-info {
    font-size: 0.875rem;
    color: var(--pt-purple-200);
  }

  span.join-us {
    width: calc(100% - 2rem);
    text-align: center;
    margin-top: calc(1em - 1rem);
    font-size: 1.75rem;
    font-weight: 600;
    color: var(--pt-purple-200);
  }

  @media (min-width: 48rem) {
    div.banner {
      width: 32rem;
    }

    div.banner > span.title {
      font-size: 1.75rem;
    }

    div.banner > span.img-wrapper {
      padding-top: 16rem;
    }
  }
</style>
