<script lang="ts">
  import { userAddress, userBalances, userLastCheckedBlockNumber, userPrizeHookStatus, userUncheckedPrizes } from '$lib/stores'
  import { pageTransition, prizeVault } from '$lib/config'
  import { fade } from 'svelte/transition'
  import { getUserUncheckedPrizes, lower } from '$lib/utils'
  import type { UncheckedPrize } from '$lib/types'
  import ConfigModalContent from '$lib/components/account/ConfigModalContent.svelte'
  import ConfigModalBanner from '$lib/components/account/ConfigModalBanner.svelte'
  import AccountBalance from '$lib/components/account/AccountBalance.svelte'
  import AccountActions from '$lib/components/account/AccountActions.svelte'
  import AccountStats from '$lib/components/account/AccountStats.svelte'
  import RewardsCard from '$lib/components/account/RewardsCard.svelte'
  import PrizesCard from '$lib/components/account/PrizesCard.svelte'
  import BackButton from '$lib/components/BackButton.svelte'
  import Loading from '$lib/components/Loading.svelte'
  import Plinko from '$lib/components/Plinko.svelte'
  import Modal from '$lib/components/Modal.svelte'

  let pageState: 'main' | 'checkingPrizes' | 'claimingBonusRewards' = 'main'
  let plinkoPrizes: UncheckedPrize[] = []

  $: vaultBalance = $userBalances[lower(prizeVault.address)]
  $: isAccountSetupNecessary =
    !!vaultBalance && !!$userPrizeHookStatus && (!$userPrizeHookStatus.isPrizeHookSet || !$userPrizeHookStatus.isSwapperSet)

  $: if (!!$userUncheckedPrizes?.list.length && pageState !== 'checkingPrizes') plinkoPrizes = $userUncheckedPrizes.list

  const onPrizesChecked = () => {
    if (!!$userAddress && !!$userUncheckedPrizes) {
      userLastCheckedBlockNumber.set($userUncheckedPrizes.queriedAtBlockNumber)
      getUserUncheckedPrizes($userAddress, { checkBlockNumber: $userUncheckedPrizes.queriedAtBlockNumber }).then(userUncheckedPrizes.set)
    }
  }
</script>

{#key pageState}
  <div
    class="page-wrapper"
    in:fade={{ duration: pageTransition.duration, delay: pageTransition.duration }}
    out:fade={{ duration: pageTransition.duration }}
  >
    {#if pageState === 'main'}
      {#if isAccountSetupNecessary}
        <Modal title="Account Setup">
          <ConfigModalBanner slot="button-content" animate={true} />
          <ConfigModalContent slot="modal-content" />
        </Modal>
      {/if}
      <AccountBalance />
      <AccountStats />
      <PrizesCard />
      <AccountActions
        onClickCheckPrizes={() => (pageState = 'checkingPrizes')}
        onClickClaimBonusRewards={() => (pageState = 'claimingBonusRewards')}
      />
    {:else if pageState === 'checkingPrizes'}
      {#if $userUncheckedPrizes && plinkoPrizes.length > 0}
        <Plinko width={300} height={500} prizes={plinkoPrizes} onStart={onPrizesChecked}>
          <div slot="end-card" class="plinko-end-card">
            {@const prizesWon = plinkoPrizes.filter((prize) => prize.userWon > 0)}

            {#if prizesWon.length > 0}
              {@const amountWon = plinkoPrizes.reduce((a, b) => a + b.size * b.userWon, 0)}
              {@const formattedAmountWon = amountWon.toLocaleString('en', { maximumFractionDigits: 2 })}

              <span>You won <strong>${formattedAmountWon}</strong>!</span>
            {:else}
              <span>Sorry, no prizes this time.</span>
            {/if}
            <img src="pooly.svg" alt="Pooly" />
          </div>
        </Plinko>
      {:else}
        <Loading />
      {/if}
      <BackButton onClick={() => (pageState = 'main')} />
    {:else if pageState === 'claimingBonusRewards'}
      <h2>Claim Bonus Rewards</h2>
      <RewardsCard />
      <BackButton onClick={() => (pageState = 'main')} />
    {/if}
  </div>
{/key}

<style>
  div.page-wrapper {
    width: 100%;
    display: inherit;
    flex-direction: inherit;
    align-items: inherit;
    gap: inherit;
  }

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

  h2 {
    text-align: center;
    margin-top: 1rem;
    padding: 0 1rem;
    font-size: 1.75rem;
    font-weight: 700;
    line-height: 150%;
  }
</style>
