<script lang="ts">
  import { userClaimableRewards, userUncheckedPrizes } from '$lib/stores'

  export let onClickCheckPrizes: () => {}
  export let onClickClaimBonusRewards: () => {}
</script>

<div>
  {#if !!$userUncheckedPrizes?.list.length}
    <button on:click={onClickCheckPrizes} class="teal-button">Check Prizes</button>
  {/if}
  {#if !!$userClaimableRewards?.length}
    <button on:click={onClickClaimBonusRewards} class="teal-button">Claim Bonuses</button>
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
