<script lang="ts">
  import { promotionInfo, userAddress, userClaimableRewards, userClaimedRewards, walletClient } from '$lib/stores'
  import { getUserClaimableRewards, getUserClaimedRewards } from '$lib/utils'

  export let disabled: boolean = false
  export let onSuccess: () => void = () => {}
  let isZapping: boolean = false

  const updateRewards = async () => {
    if (!!$promotionInfo && !!$userAddress) {
      userClaimableRewards.set(await getUserClaimableRewards($promotionInfo, $userAddress))
      userClaimedRewards.set(await getUserClaimedRewards($promotionInfo, $userAddress))
    }
  }
</script>

{#if !$walletClient || !$userAddress}
  <button class="teal-button" disabled={true}>Claim & Redeposit Bonuses</button>
{:else}
  <!-- TODO: add on:click to zap all possible claimable rewards (need dskit support for multiple actions) -->
  <button type="submit" class="teal-button" disabled={true}>Claim & Redeposit Bonuses</button>
  <!-- <button type="submit" class="teal-button" disabled={isZapping || disabled}>Claim & Redeposit Bonuses</button> -->
{/if}
