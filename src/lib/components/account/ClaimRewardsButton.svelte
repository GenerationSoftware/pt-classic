<script lang="ts">
  import { promotionInfo, userAddress, userBalances, userClaimableRewards, userClaimedRewards, walletClient } from '$lib/stores'
  import { claimBonusRewards, getTokenBalances, getUserClaimableRewards, getUserClaimedRewards } from '$lib/utils'
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

  const updateBalances = async () => {
    if (!!$userAddress) {
      const updatedBalances = await getTokenBalances($userAddress, [prizeVault.address, prizeVault.asset.address])
      userBalances.update((oldBalances) => ({ ...oldBalances, ...updatedBalances }))
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
          updateBalances()
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
