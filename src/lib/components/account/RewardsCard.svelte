<script lang="ts">
  import { tokenPrices, userClaimableRewards } from '$lib/stores'
  import { prizeVault } from '$lib/config'
  import { formatUnits } from 'viem'
  import { lower } from '$lib/utils'
  import type { ClaimableReward } from '$lib/types'
  import ClaimRewardsButton from './ClaimRewardsButton.svelte'
  import SuccessPooly from '../SuccessPooly.svelte'
  import Loading from '../Loading.svelte'

  let isSuccessfulClaim = false

  const getPromotionRewardAmount = (reward: ClaimableReward) => {
    return parseFloat(
      formatUnits(
        Object.values(reward.epochs).reduce((a, b) => a + b, 0n),
        reward.token.decimals
      )
    )
  }

  $: totalClaimableBonusRewards =
    $userClaimableRewards?.reduce((a, b) => {
      const tokenAmount = getPromotionRewardAmount(b)
      const tokenPrice = $tokenPrices[lower(b.token.address)] ?? 0
      return a + tokenAmount * tokenPrice
    }, 0) ?? 0
  $: formattedTotalClaimableBonusRewards = totalClaimableBonusRewards.toLocaleString('en', {
    minimumFractionDigits: prizeVault.asset.isUsdEquivalent ? 2 : (prizeVault.asset.displayDecimals ?? 4),
    maximumFractionDigits: prizeVault.asset.isUsdEquivalent ? 2 : (prizeVault.asset.displayDecimals ?? 4)
  })
  $: isFetchedBonusRewardsTokenPrices = $userClaimableRewards?.every((reward) => $tokenPrices[lower(reward.token.address)] !== undefined)
</script>

<div class="card">
  {#if !isSuccessfulClaim}
    {#if !!$userClaimableRewards && isFetchedBonusRewardsTokenPrices}
      {#if $userClaimableRewards.length > 0}
        {#if prizeVault.asset.isUsdEquivalent}
          <span class="rewards-title">You have <strong>${formattedTotalClaimableBonusRewards}</strong> in bonus rewards to claim</span>
        {:else}
          <span class="rewards-title">
            You have <strong>{formattedTotalClaimableBonusRewards} {prizeVault.asset.symbol}</strong> in bonus rewards to claim
          </span>
        {/if}
        <div class="rewards-list">
          {#each $userClaimableRewards as reward}
            {@const rewardAmount = getPromotionRewardAmount(reward)}
            {@const formattedRewardAmount = rewardAmount.toLocaleString('en', { maximumFractionDigits: 4 })}

            <div class="reward-item">
              <span>Unclaimed Reward</span>
              <span>{formattedRewardAmount} {reward.token.symbol}</span>
            </div>
          {/each}
        </div>
        <ClaimRewardsButton onSuccess={() => (isSuccessfulClaim = true)} />
      {:else}
        <span class="rewards-title">You don't have any bonus rewards to claim</span>
      {/if}
    {:else}
      <Loading height="1rem" />
    {/if}
  {:else}
    <h3 class="success-title">Success!</h3>
    <span class="success-info">You claimed your available bonus rewards</span>
    <SuccessPooly style="max-height: 7.5rem; margin: 2rem 0 1rem;" />
  {/if}
</div>

<style>
  div.card {
    --padding: 1.5rem;
    width: min(calc(100% - 2rem - (2 * var(--padding))), calc(32rem - (2 * var(--padding))));
    display: flex;
    flex-direction: column;
    padding: var(--padding);
    text-align: center;
    background-color: var(--pt-transparent);
    border-radius: 1.5rem;
    overflow: hidden;
  }

  span.rewards-title {
    font-size: 1.25rem;
    font-weight: 600;
    line-height: 150%;
  }

  span.rewards-title > strong {
    color: var(--pt-teal-light);
  }

  div.rewards-list {
    margin: 1rem 0;
  }

  div.reward-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 1rem;
    padding: 0.5rem 0.75rem;
    background-color: var(--pt-transparent);
    border-radius: 0.5rem;
  }

  div.reward-item > span:first-child {
    color: var(--pt-purple-300);
  }

  div.reward-item > span:last-child {
    color: var(--pt-teal-light);
  }

  h3.success-title {
    color: var(--pt-teal-dark);
    font-size: 1.75rem;
    font-weight: 700;
    line-height: 150%;
  }

  span.success-info {
    color: var(--pt-purple-100);
    font-size: 1.25rem;
    font-weight: 600;
    line-height: 150%;
  }
</style>
