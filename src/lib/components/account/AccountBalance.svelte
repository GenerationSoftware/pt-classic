<script>
  import { userAddress, userFlashEvents, userLastCheckedBlockNumber, userTransferEvents } from '$lib/stores'
  import { formatPrize, formatShareAmount, lower } from '$lib/utils'
  import Loading from '../Loading.svelte'

  $: aggregatedTransferAmount =
    !!$userTransferEvents && !!$userAddress
      ? $userTransferEvents.reduce(
          (a, b) =>
            lower(b.args.to) === lower($userAddress)
              ? a + BigInt(b.args.value)
              : lower(b.args.from) === lower($userAddress)
                ? a - BigInt(b.args.value)
                : a,
          0n
        )
      : 0n

  $: prizesWon = $userFlashEvents?.map(formatPrize) ?? []
  $: uncheckedPrizesWon = prizesWon.filter(
    (prize) => $userLastCheckedBlockNumber === undefined || prize.blockNumber > $userLastCheckedBlockNumber
  )
  $: totalUncheckedPrizesWon = uncheckedPrizesWon.reduce((a, b) => a + b.amount, 0n)

  $: totalSaved = aggregatedTransferAmount - totalUncheckedPrizesWon
  $: formattedTotalSaved = totalSaved > 0n ? formatShareAmount(totalSaved) : '0.00'
</script>

<div>
  <h2>Total Saved</h2>
  {#if !!$userTransferEvents && !!$userFlashEvents}
    <span class="balance">${formattedTotalSaved}</span>
  {:else if !$userAddress}
    <span>-</span>
  {:else}
    <Loading height="1rem" style="margin: 0.8125rem 0;" />
  {/if}
</div>

<style>
  div {
    width: calc(100% - 2rem);
    display: flex;
    flex-direction: column;
    align-items: center;
    margin: 1rem 0;
  }

  h2 {
    color: var(--pt-purple-200);
    line-height: 150%;
  }

  span {
    font-size: 1.75rem;
    font-weight: 700;
    line-height: 150%;
  }

  span.balance {
    color: var(--pt-teal-dark);
  }
</style>
