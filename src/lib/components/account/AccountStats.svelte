<script lang="ts">
  import { isFetchedUserFlashEvents, isFetchedUserTransferEvents, userAddress, userFlashEvents, userTransferEvents } from '$lib/stores'
  import { formatPrize, formatShareAmount, lower } from '$lib/utils'
  import { prizePool } from '$lib/config'
  import { formatUnits } from 'viem'
  import Loading from '../Loading.svelte'

  // TODO: this needs to only display checked prizes
  $: totalPrizesWon = $userFlashEvents.map((flashEvent) => formatPrize(flashEvent)).reduce((a, b) => a + b.amount, 0n)
  $: formattedTotalPrizesWon = totalPrizesWon !== undefined ? formatShareAmount(totalPrizesWon) : '?'

  $: aggregatedTransferAmount = !!$userAddress
    ? $userTransferEvents.reduce(
        (a, b) =>
          lower(b.args.to) === lower($userAddress) ? a + b.args.value : lower(b.args.from) === lower($userAddress) ? a - b.args.value : a,
        0n
      )
    : 0n
  $: totalDepositedAmount = aggregatedTransferAmount - totalPrizesWon
  $: formattedTotalDepositedAmount = totalDepositedAmount >= 0n ? formatShareAmount(totalDepositedAmount) : '?'

  // TODO: get total won as bonus rewards
  // TODO: convert to $ value
  $: bonusRewardsClaimed = 0n
  $: formattedBonusRewardsClaimed =
    bonusRewardsClaimed !== undefined
      ? parseFloat(formatUnits(bonusRewardsClaimed, prizePool.prizeToken.decimals)).toLocaleString('en', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2
        })
      : ''
</script>

<div class="wrapper">
  <div class="stat">
    <h3>Total Deposited</h3>
    {#if isFetchedUserTransferEvents && isFetchedUserFlashEvents}
      <span>${formattedTotalDepositedAmount}</span>
    {:else}
      <Loading />
    {/if}
  </div>
  <div class="stat">
    <h3>Total Prizes Won</h3>
    {#if isFetchedUserFlashEvents}
      <span>+${formattedTotalPrizesWon}</span>
    {:else}
      <Loading />
    {/if}
  </div>
  <div class="stat">
    <h3>Total Bonus Rewards Claimed</h3>
    {#if bonusRewardsClaimed !== undefined}
      <span>+${formattedBonusRewardsClaimed}</span>
    {:else}
      <Loading />
    {/if}
  </div>
</div>

<style>
  div.wrapper {
    width: calc(100% - 3rem);
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }

  div.stat {
    width: 100%;
    display: flex;
    justify-content: space-between;
  }

  h3 {
    color: var(--pt-purple-200);
    font-size: 0.875rem;
    line-height: 150%;
  }

  span {
    font-size: 0.875rem;
    font-weight: 600;
    line-height: 150%;
  }
</style>
