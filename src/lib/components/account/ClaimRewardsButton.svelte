<script lang="ts">
  import { claimBonusRewards, getUserClaimableRewards, getUserClaimedRewards, updateUserTokenBalances } from '$lib/utils'
  import { clients, promotionInfo, userAddress, userClaimableRewards, userClaimedRewards } from '$lib/stores'
  import Loading from '../Loading.svelte'

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

{#if !$clients.wallet || !$userAddress || !$userClaimableRewards?.length}
  <button disabled={true}>Claim Bonuses</button>
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
          updateUserTokenBalances($userAddress)
        }
      })}
    class="teal-button"
    disabled={isClaiming || disabled}
  >
    {#if isClaiming}
      <Loading height=".75rem" />
    {:else}
      Claim Bonuses
    {/if}
  </button>
{/if}
