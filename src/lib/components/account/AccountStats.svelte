<script>
  import { prizePool, prizeVault } from '$lib/config'
  import { formatUnits } from 'viem'
  import Loading from '../Loading.svelte'

  // TODO: get total deposited (only manual user deposits)
  // TODO: need to distinguish between weth zaps and prize zaps
  $: deposited = 0n
  $: formattedDeposited =
    deposited !== undefined
      ? parseFloat(formatUnits(deposited, prizeVault.decimals)).toLocaleString('en', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
      : ''

  // TODO: get total won as prizes
  // TODO: convert to $ value
  $: prizesWon = 0n
  $: formattedTotalPrizesWon =
    prizesWon !== undefined
      ? parseFloat(formatUnits(prizesWon, prizePool.prizeToken.decimals)).toLocaleString('en', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2
        })
      : ''

  // TODO: get total won as bonus rewards
  // TODO: convert to $ value
  $: bonusRewardsClaimed = 0n
  $: formattedBonusRewardsClaimed =
    bonusRewardsClaimed !== undefined
      ? parseFloat(formatUnits(bonusRewardsClaimed, prizePool.prizeToken.decimals)).toLocaleString('en', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2
        })
      : ''
</script>

<div class="wrapper">
  <div class="stat">
    <h3>Total Deposited</h3>
    {#if deposited !== undefined}
      <span>${formattedDeposited}</span>
    {:else}
      <Loading />
    {/if}
  </div>
  <div class="stat">
    <h3>Total Prizes Won</h3>
    {#if prizesWon !== undefined}
      <span>+${formattedTotalPrizesWon}</span>
    {:else}
      <Loading />
    {/if}
  </div>
  <div class="stat">
    <h3>Total Bonus Rewards Claimed</h3>
    {#if bonusRewardsClaimed !== undefined}
      <span>+${formattedBonusRewardsClaimed}</span>
    {:else}
      <Loading />
    {/if}
  </div>
</div>

<style>
  div.wrapper {
    width: calc(100% - 3rem);
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }

  div.stat {
    width: 100%;
    display: flex;
    justify-content: space-between;
  }

  h3 {
    color: var(--pt-purple-200);
    font-size: 0.875rem;
    line-height: 150%;
  }

  span {
    font-size: 0.875rem;
    font-weight: 600;
    line-height: 150%;
  }
</style>
