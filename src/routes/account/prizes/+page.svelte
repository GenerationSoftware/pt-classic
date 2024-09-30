<script lang="ts">
  import { userAddress, userLastCheckedBlockNumber, userUncheckedPrizes } from '$lib/stores'
  import { getUserUncheckedPrizes } from '$lib/utils'
  import { prizeVault } from '$lib/config'
  import { goto } from '$app/navigation'
  import BackButton from '$lib/components/BackButton.svelte'
  import Plinko from '$lib/components/Plinko.svelte'

  const plinkoPrizes = $userUncheckedPrizes?.list ?? []
  let innerWidth: number
  let plinkoDimensions: { width: number; height: number; columns: 4 | 5 | 6 | 7 }

  $: if (!!innerWidth && !plinkoDimensions) {
    plinkoDimensions = innerWidth > 1760 ? { width: 480, height: 800, columns: 6 } : { width: 300, height: 500, columns: 4 }
  }

  const onPrizesChecked = () => {
    if (!!$userAddress && !!$userUncheckedPrizes) {
      userLastCheckedBlockNumber.set($userUncheckedPrizes.queriedAtBlockNumber)
      getUserUncheckedPrizes($userAddress, { checkBlockNumber: $userUncheckedPrizes.queriedAtBlockNumber }).then(userUncheckedPrizes.set)
    }
  }
</script>

<svelte:window bind:innerWidth />

{#if !!plinkoPrizes.length && !!plinkoDimensions}
  <Plinko {...plinkoDimensions} prizes={plinkoPrizes} onStart={onPrizesChecked}>
    <div slot="end-card" class="plinko-end-card">
      {@const prizesWon = plinkoPrizes.filter((prize) => prize.userWon > 0)}

      {#if prizesWon.length > 0}
        {@const amountWon = plinkoPrizes.reduce((a, b) => a + b.size * b.userWon, 0)}
        {@const formattedAmountWon = amountWon.toLocaleString('en', {
          maximumFractionDigits: prizeVault.asset.isUsdEquivalent ? 2 : (prizeVault.asset.displayDecimals ?? 4)
        })}

        <span>
          You won <strong>
            {#if prizeVault.asset.isUsdEquivalent}
              ${formattedAmountWon}
            {:else}
              {formattedAmountWon} {prizeVault.asset.symbol}
            {/if}
          </strong>!
        </span>
      {:else}
        <span>Sorry, no prizes this time.</span>
      {/if}
      <img src="/pooly.svg" alt="Pooly" />
    </div>
  </Plinko>
{/if}

<BackButton onClick={() => goto('/account')} />

<style>
  div.plinko-end-card {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  div.plinko-end-card > span {
    text-align: center;
    font-size: 1.5rem;
    font-weight: 600;
    line-height: 150%;
  }

  div.plinko-end-card > span > strong {
    color: var(--pt-teal-light);
  }

  div.plinko-end-card > img {
    height: 6rem;
  }
</style>
