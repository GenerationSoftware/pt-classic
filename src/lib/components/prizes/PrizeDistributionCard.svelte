<script>
  import { formatPrizeFrequency, lower } from '$lib/utils'
  import { prizeDistribution, tokenPrices } from '$lib/stores'
  import { prizePool } from '$lib/config'
  import { formatUnits } from 'viem'
  import Loading from '../Loading.svelte'

  // TODO: filter out really small prizes?
  $: prizesToDisplay = $prizeDistribution?.slice(0, -2)
  $: prizeTokenPrice = $tokenPrices[lower(prizePool.prizeToken.address)]
</script>

<div class="content-wrapper">
  {#if !!prizesToDisplay && !!prizeTokenPrice}
    {#each prizesToDisplay as prize}
      {@const prizeSize = parseFloat(formatUnits(prize.size, prizePool.prizeToken.decimals))}
      {@const prizeValue = prizeSize * prizeTokenPrice}
      {@const formattedPrizeValue = prizeValue.toLocaleString('en', { maximumFractionDigits: prizeValue >= 10 ? 0 : 2 })}
      {@const formattedFrequency = formatPrizeFrequency(prize.drawFrequency)}

      <div class="prize-row">
        <span class="prize-value">{formattedPrizeValue}</span>
        <div class="prize-freq">
          <span>awarded on average</span>
          <span>{formattedFrequency}</span>
        </div>
      </div>
    {/each}
  {:else}
    <Loading />
  {/if}
</div>

<style>
  div.content-wrapper {
    width: calc(100% - 2rem);
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

  div.prize-freq {
    display: flex;
    flex-direction: column;
    align-items: end;
    text-align: right;
  }

  div.prize-freq > span:nth-child(1) {
    color: var(--pt-purple-100);
    font-size: 0.75rem;
  }

  div.prize-freq > span:nth-child(2) {
    color: var(--pt-purple-300);
    font-size: 1.125rem;
  }
</style>
