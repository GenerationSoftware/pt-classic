<script lang="ts">
  import { claimBonusRewards, getUserClaimableRewards, getUserClaimedRewards, updateUserTokenBalances } from '$lib/utils'
  import { promotionInfo, userAddress, userClaimableRewards, userClaimedRewards, walletClient } from '$lib/stores'
  import { dolphinAddress } from '$lib/constants'
  import { prizeVault } from '$lib/config'

  export let disabled: boolean = false
  export let onSuccess: () => void = () => {}
  let isClaiming: boolean = false

  const updateRewards = async () => {
    if (!!$promotionInfo && !!$userAddress) {
      userClaimableRewards.set(await getUserClaimableRewards($promotionInfo, $userAddress))
      userClaimedRewards.set(await getUserClaimedRewards($promotionInfo, $userAddress))
    }
  }
</script>

{#if !$walletClient || !$userAddress || !$userClaimableRewards?.length}
  <button disabled={true}>Only Claim Bonuses</button>
{:else}
  <button
    type="submit"
    on:click={() =>
      claimBonusRewards($userClaimableRewards, {
        onSend: () => {
          isClaiming = true
        },
        onSuccess: () => {
          updateRewards()
          onSuccess()
        },
        onSettled: () => {
          isClaiming = false
          updateUserTokenBalances($userAddress, [dolphinAddress, prizeVault.address, prizeVault.asset.address])
        }
      })}
    disabled={isClaiming || disabled}>Only Claim Bonuses</button
  >
{/if}

<style>
  button {
    margin-top: 0.375rem;
    color: var(--pt-purple-100);
    font-size: 0.875rem;
    font-weight: 500;
    line-height: 150%;
    text-decoration: underline;
  }
</style>
