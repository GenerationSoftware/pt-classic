<script>
  import { formatPrizeFrequency, getPrizeDistribution, lower } from '$lib/utils'
  import { prizeDistribution, tokenPrices } from '$lib/stores'
  import { prizePool } from '$lib/config'
  import { formatUnits } from 'viem'
  import { onMount } from 'svelte'
  import Loading from '../Loading.svelte'

  $: prizeTokenPrice = $tokenPrices[lower(prizePool.prizeToken.address)]

  onMount(() => {
    getPrizeDistribution().then(prizeDistribution.set)
  })
</script>

<div class="content-wrapper">
  {#if !!$prizeDistribution && !!prizeTokenPrice}
    {#each $prizeDistribution as prize}
      {@const prizeSize = parseFloat(formatUnits(prize.size, prizePool.prizeToken.decimals))}
      {@const prizeValue = prizeSize * prizeTokenPrice}
      {@const formattedPrizeValue = prizeValue.toLocaleString('en', { maximumFractionDigits: prizeValue >= 1 ? 0 : 2 })}
      {@const formattedFrequency = formatPrizeFrequency(prize.drawFrequency)}

      <div class="prize-row">
        <span class="prize-value">${formattedPrizeValue}</span>
        <span class="prize-freq">{formattedFrequency}</span>
      </div>
    {/each}
    <p class="description">
      These are the best probabilistic estimates we can provide. Each tier's prize size grows over time until awarded, and their frequency
      is random.
    </p>
  {:else}
    <Loading />
  {/if}
</div>

<style>
  div.content-wrapper {
    width: calc(100% - 2rem);
    max-width: 22rem;
    display: flex;
    flex-direction: column;
  }

  div.prize-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    opacity: 0.9;
  }

  span.prize-value {
    color: var(--pt-teal-light);
    font-size: 1.875rem;
    font-weight: 600;
    line-height: 150%;
  }

  span.prize-freq {
    text-align: right;
    color: var(--pt-purple-100);
    font-size: 1.125rem;
  }

  p.description {
    margin-top: 1rem;
    text-align: center;
    color: var(--pt-purple-300);
    font-size: 0.875rem;
    font-weight: 500;
    line-height: 150%;
  }

  @media (min-width: 48rem) {
    div.content-wrapper {
      max-width: 25rem;
    }
  }
</style>
