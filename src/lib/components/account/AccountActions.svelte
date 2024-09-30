<script>
  import { userClaimableRewards, userUncheckedPrizes } from '$lib/stores'
</script>

<div>
  {#if !!$userUncheckedPrizes?.list.length}
    <a href="/account/prizes" class="teal-button">Check Prizes</a>
  {/if}
  {#if !!$userClaimableRewards?.length}
    <a href="/account/rewards" class="teal-button">Claim Bonuses</a>
  {/if}
</div>

<style>
  div {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 1rem;
  }
</style>
