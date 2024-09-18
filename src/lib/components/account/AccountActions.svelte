<script>
  import { userAddress, userClaimableRewards } from '$lib/stores'
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
  $: isCheckPrizesEnabled = !!totalAwardedSinceLastChecked && formattedTotalAwardedSinceLastChecked !== '0'
</script>

{#if !!$userAddress}
  <div class="content-wrapper">
    <div class="buttons">
      {#if isCheckPrizesEnabled}
        <a href="/#/account/prizes" class="teal-button">Check Prizes</a>
      {/if}
      {#if !!$userClaimableRewards?.length}
        <a href="/#/account/bonus" class="teal-button">Claim Bonuses</a>
      {/if}
    </div>
    {#if isCheckPrizesEnabled}
      <span><strong>${formattedTotalAwardedSinceLastChecked}</strong> in prizes awarded since you last checked!</span>
    {/if}
  </div>
{/if}

<style>
  div.content-wrapper {
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
