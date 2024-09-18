<script lang="ts">
  import { blockExplorerUrl } from '$lib/config'
  import { getBlockDate, type formatClaimedReward, type formatFallbackPrize, type formatPrize } from '$lib/utils'
  import Loading from '../Loading.svelte'
  import Modal from '../Modal.svelte'

  export let prize: ReturnType<typeof formatPrize> | ReturnType<typeof formatFallbackPrize> | ReturnType<typeof formatClaimedReward>
</script>

<Modal title={prize.type === 'fallbackPrize' ? 'Prize Details' : 'Reward Details'}>
  <slot name="button-content" slot="button-content" />
  <div slot="modal-content" class="modal-content">
    {#if prize.type === 'fallbackPrize'}
      <em class="fallback-prize-description">
        This prize was not able to be automatically compounded back into your savings. Ensure your account is configured correctly to avoid
        this happening again in the future.
      </em>
    {/if}
    <div class="item">
      <span>Date:</span>
      {#await getBlockDate(prize.blockNumber)}
        <Loading height=".75rem" />
      {:then date}
        <span>{date}</span>
      {/await}
    </div>
    {#if prize.type === 'fallbackPrize'}
      <div class="item">
        <span>Prize Amount:</span>
        <span>{prize.token.formattedAmount} {prize.token.symbol}</span>
      </div>
      <div class="item">
        <span>Token Price:</span>
        <span>${prize.token.price ?? '?'}</span>
      </div>
      <div class="item">
        <span>Prize Value:</span>
        <span>${prize.formattedAmount}</span>
      </div>
    {:else if prize.type === 'bonusReward'}
      <div class="item">
        <span>Reward Amount:</span>
        <span>{prize.token.formattedAmount} {prize.token.symbol}</span>
      </div>
      <div class="item">
        <span>Token Price:</span>
        <span>${prize.token.price ?? '?'}</span>
      </div>
      <div class="item">
        <span>Reward Value:</span>
        <span>${prize.formattedAmount}</span>
      </div>
    {:else}
      <div class="item">
        <span>Prize Amount:</span>
        <span>${prize.formattedAmount}</span>
      </div>
    {/if}
    <div class="item">
      <span>Transaction:</span>
      <a href={`${blockExplorerUrl}tx/${prize.txHash}`} target="_blank">{prize.txHash.slice(0, 12)}...</a>
    </div>
  </div>
</Modal>

<style>
  div.modal-content {
    display: flex;
    flex-direction: column;
    text-align: start;
  }

  em.fallback-prize-description {
    margin-bottom: 1rem;
    color: var(--pt-purple-100);
    font-size: 0.75rem;
    line-height: normal;
  }

  div.item {
    display: flex;
    align-items: center;
    gap: 1ch;
  }

  div.item > span:first-child {
    font-weight: 500;
  }

  div.item > *:not(:first-child) {
    color: var(--pt-purple-50);
  }
</style>
