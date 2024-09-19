<script lang="ts">
  import { userBalances, userPrizeHookStatus } from '$lib/stores'
  import { pageTransition, prizeVault } from '$lib/config'
  import { fade } from 'svelte/transition'
  import { lower } from '$lib/utils'
  import ConfigModalContent from '$lib/components/account/ConfigModalContent.svelte'
  import ConfigModalBanner from '$lib/components/account/ConfigModalBanner.svelte'
  import AccountBalance from '$lib/components/account/AccountBalance.svelte'
  import AccountActions from '$lib/components/account/AccountActions.svelte'
  import AccountStats from '$lib/components/account/AccountStats.svelte'
  import RewardsCard from '$lib/components/account/RewardsCard.svelte'
  import PrizesCard from '$lib/components/account/PrizesCard.svelte'
  import BackButton from '$lib/components/BackButton.svelte'
  import Modal from '$lib/components/Modal.svelte'
  import Plinko from '$lib/components/plinko/Plinko.svelte'
  import type { Prize } from '$lib/components/plinko/types'

  let pageState: 'main' | 'checkingPrizes' | 'claimingBonusRewards' = 'main'

  $: vaultBalance = $userBalances[lower(prizeVault.address)]
  $: isAccountSetupNecessary =
    !!vaultBalance && !!$userPrizeHookStatus && (!$userPrizeHookStatus.isPrizeHookSet || !$userPrizeHookStatus.isSwapperSet)

  const plinkoPrizes: Prize[] = [
    {
      size: 1000,
      count: 1,
      userOdds: 0.0001,
      userWon: 0
    },
    {
      size: 122,
      count: 4,
      userOdds: 0.01,
      userWon: 1
    },
    {
      size: 2,
      count: 64,
      userOdds: 0.15,
      userWon: 5
    }
  ]
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
      <!-- TODO: plinko game to check wins -->
      <Plinko width={300} height={500} prizes={plinkoPrizes}></Plinko>
      <!-- TODO: show prizes won -->
      <span>WE BUIDLING</span>
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

  h2 {
    text-align: center;
    margin-top: 1rem;
    padding: 0 1rem;
    font-size: 1.75rem;
    font-weight: 700;
    line-height: 150%;
  }
</style>
