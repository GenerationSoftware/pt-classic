<script lang="ts">
  import { tokenPrices, userClaimableRewards } from '$lib/stores'
  import { formatUnits } from 'viem'
  import { lower } from '$lib/utils'
  import ClaimRewardsButton from './ClaimRewardsButton.svelte'
  import ZapRewardsButton from './ZapRewardsButton.svelte'
  import SuccessPooly from '../SuccessPooly.svelte'
  import Loading from '../Loading.svelte'

  let isSuccessfulRewardsClaim = false
  let isSuccessfulRewardsZap = false

  $: totalClaimableBonusRewards =
    $userClaimableRewards?.reduce((a, b) => {
      const tokenAmount = parseFloat(
        formatUnits(
          Object.values(b.epochs).reduce((c, d) => c + d, 0n),
          b.token.decimals
        )
      )
      const tokenPrice = $tokenPrices[lower(b.token.address)] ?? 0
      return a + tokenAmount * tokenPrice
    }, 0) ?? 0
  $: formattedTotalClaimableBonusRewards = totalClaimableBonusRewards.toLocaleString('en', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })
  $: isFetchedBonusRewardsTokenPrices = $userClaimableRewards?.every((reward) => $tokenPrices[lower(reward.token.address)] !== undefined)
</script>

<div class="card">
  {#if !isSuccessfulRewardsClaim && !isSuccessfulRewardsZap}
    {#if !!$userClaimableRewards && isFetchedBonusRewardsTokenPrices}
      {#if $userClaimableRewards.length > 0}
        <span class="rewards-title">You have <strong>${formattedTotalClaimableBonusRewards}</strong> in bonus rewards to claim</span>
        <!-- TODO: display bonus rewards -->
        <ZapRewardsButton onSuccess={() => (isSuccessfulRewardsZap = true)} />
        <ClaimRewardsButton onSuccess={() => (isSuccessfulRewardsClaim = true)} />
      {:else}
        <span class="rewards-title">You don't have any bonus rewards to claim</span>
      {/if}
    {:else}
      <Loading height="1rem" />
    {/if}
  {:else}
    <h3 class="success-title">Success!</h3>
    {#if isSuccessfulRewardsClaim}
      <span class="success-info">You claimed your available bonus rewards</span>
    {:else if isSuccessfulRewardsZap}
      <span class="success-info">You claimed and redeposited your bonus rewards</span>
    {/if}
    <SuccessPooly style="max-height: 7.5rem; margin: 2rem 0 1rem;" />
  {/if}
</div>

<style>
  div.card {
    --padding: 1.5rem;
    width: calc(100% - 2rem - (2 * var(--padding)));
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
