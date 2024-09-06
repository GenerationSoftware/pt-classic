<script>
  import { prizePool } from '$lib/config'
  import { formatUnits } from 'viem'

  // TODO: get amount of prizes awarded since user last checked
  $: totalAwardedSinceLastChecked = 0n
  $: formattedTotalAwardedSinceLastChecked =
    totalAwardedSinceLastChecked !== undefined
      ? parseFloat(formatUnits(totalAwardedSinceLastChecked, prizePool.prizeToken.decimals)).toLocaleString('en', {
          maximumFractionDigits: 0
        })
      : ''
</script>

<div class="wrapper">
  <div class="buttons">
    <a href="/account/prizes" class="teal-button">Check Prizes</a>
    <a href="/account/bonus" class="teal-button">Claim Bonus</a>
  </div>
  {#if !!totalAwardedSinceLastChecked && formattedTotalAwardedSinceLastChecked !== '0'}
    <span><strong>${formattedTotalAwardedSinceLastChecked}</strong> in prizes awarded since you last checked!</span>
  {/if}
</div>

<style>
  div.wrapper {
    width: calc(100% - 2rem);
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
  }

  div.buttons {
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 1rem;
  }

  span {
    font-size: 0.875rem;
    line-height: 150%;
  }

  span > strong {
    color: var(--pt-purple-300);
    font-weight: 400;
  }
</style>
