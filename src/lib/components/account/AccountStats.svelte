<script>
  import {
    tokenPrices,
    userAddress,
    userClaimedPrizeEvents,
    userClaimedRewards,
    userFlashEvents,
    userLastCheckedBlockNumber,
    userTransferEvents
  } from '$lib/stores'
  import { formatFallbackPrize, formatPrize, formatShareAmount, lower } from '$lib/utils'
  import { formatUnits } from 'viem'
  import Loading from '../Loading.svelte'

  $: prizesWon = $userFlashEvents?.map(formatPrize) ?? []
  $: totalPrizesWon = prizesWon.reduce((a, b) => a + b.amount, 0n)

  $: checkedPrizesWon = prizesWon.filter(
    (prize) => $userLastCheckedBlockNumber !== undefined && prize.blockNumber <= $userLastCheckedBlockNumber
  )
  $: totalCheckedPrizesWon = checkedPrizesWon.reduce((a, b) => a + b.amount, 0n)

  $: fallbackPrizesWon =
    $userClaimedPrizeEvents
      ?.filter((e) => !!BigInt(e.args.payout))
      .map((claimedPrizeEvent) => formatFallbackPrize(claimedPrizeEvent, $tokenPrices)) ?? []

  $: checkedFallbackPrizesWon = fallbackPrizesWon.filter(
    (fallbackPrize) => $userLastCheckedBlockNumber !== undefined && fallbackPrize.blockNumber <= $userLastCheckedBlockNumber
  )
  $: totalCheckedFallbackPrizesWon = checkedFallbackPrizesWon.reduce((a, b) => a + b.amount, 0n)

  $: formattedTotalCheckedPrizesWon = formatShareAmount(totalCheckedPrizesWon + totalCheckedFallbackPrizesWon)

  $: aggregatedTransferAmount =
    !!$userTransferEvents && !!$userAddress
      ? $userTransferEvents.reduce(
          (a, b) =>
            lower(b.args.to) === lower($userAddress)
              ? a + BigInt(b.args.value)
              : lower(b.args.from) === lower($userAddress)
                ? a - BigInt(b.args.value)
                : a,
          0n
        )
      : 0n
  $: totalDepositedAmount = aggregatedTransferAmount - totalPrizesWon
  $: formattedTotalDepositedAmount = totalDepositedAmount >= 0n ? formatShareAmount(totalDepositedAmount) : '?'

  $: aggregatedBonusRewardsClaimed =
    $userClaimedRewards?.reduce((a, b) => {
      const tokenAmount = parseFloat(formatUnits(b.amount, b.token.decimals))
      const tokenPrice = $tokenPrices[lower(b.token.address)] ?? 0
      return a + tokenAmount * tokenPrice
    }, 0) ?? 0
  $: formattedBonusRewardsClaimed = aggregatedBonusRewardsClaimed.toLocaleString('en', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })
  $: isFetchedBonusRewardsTokenPrices = $userClaimedRewards?.every((reward) => $tokenPrices[lower(reward.token.address)] !== undefined)
</script>

<div class="stats">
  <div class="stat">
    <h3>Total Deposited</h3>
    {#if !!$userTransferEvents && !!$userFlashEvents}
      <span>${formattedTotalDepositedAmount}</span>
    {:else if !$userAddress}
      <span>-</span>
    {:else}
      <Loading height=".75rem" />
    {/if}
  </div>
  <div class="stat">
    <h3>Total Prizes Won</h3>
    {#if !!$userFlashEvents && !!$userClaimedPrizeEvents}
      <span>+${formattedTotalCheckedPrizesWon}</span>
    {:else if !$userAddress}
      <span>-</span>
    {:else}
      <Loading height=".75rem" />
    {/if}
  </div>
  <div class="stat">
    <h3>Total Bonus Rewards Claimed</h3>
    {#if !!$userClaimedRewards && !!isFetchedBonusRewardsTokenPrices}
      <span>+${formattedBonusRewardsClaimed}</span>
    {:else if !$userAddress}
      <span>-</span>
    {:else}
      <Loading height=".75rem" />
    {/if}
  </div>
</div>

<style>
  div.stats {
    width: min(calc(100% - 3rem), 32rem);
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
