<script lang="ts">
  import { promotionInfo, userAddress, userBalances, userClaimableRewards, userClaimedRewards, walletClient } from '$lib/stores'
  import { getTokenBalances, getUserClaimableRewards, getUserClaimedRewards } from '$lib/utils'
  import { prizeVault } from '$lib/config'

  export let disabled: boolean = false
  export let onSuccess: () => void = () => {}
  let isZapping: boolean = false

  const updateRewards = async () => {
    if (!!$promotionInfo && !!$userAddress) {
      userClaimableRewards.set(await getUserClaimableRewards($promotionInfo, $userAddress))
      userClaimedRewards.set(await getUserClaimedRewards($promotionInfo, $userAddress))
    }
  }

  const updateBalances = async () => {
    if (!!$userAddress) {
      const updatedBalances = await getTokenBalances($userAddress, [prizeVault.address, prizeVault.asset.address])
      userBalances.update((oldBalances) => ({ ...oldBalances, ...updatedBalances }))
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
