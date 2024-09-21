<script lang="ts">
  import { clients, promotionInfo, userAddress, userClaimableRewards, userClaimedRewards } from '$lib/stores'
  import { getUserClaimableRewards, getUserClaimedRewards } from '$lib/utils'
  import Loading from '../Loading.svelte'

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

{#if !$clients.wallet || !$userAddress}
  <button class="teal-button" disabled={true}>Claim & Redeposit Bonuses</button>
{:else}
  <!-- TODO: add on:click to zap all possible claimable rewards (need dskit support for multiple actions) -->
  <button type="submit" class="teal-button" disabled={isZapping || disabled}>
    {#if isZapping}
      <Loading height=".75rem" />
    {:else}
      Claim & Redeposit Bonuses
    {/if}
  </button>
  <!-- <button type="submit" class="teal-button" disabled={isZapping || disabled}>Claim & Redeposit Bonuses</button> -->
{/if}
