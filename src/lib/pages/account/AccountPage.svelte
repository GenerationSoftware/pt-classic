<script>
  import { userBalances, userPrizeHookStatus } from '$lib/stores'
  import { prizeVault } from '$lib/config'
  import { lower } from '$lib/utils'
  import ConfigModalContent from '$lib/components/account/ConfigModalContent.svelte'
  import ConfigModalBanner from '$lib/components/account/ConfigModalBanner.svelte'
  import AccountBalance from '$lib/components/account/AccountBalance.svelte'
  import AccountActions from '$lib/components/account/AccountActions.svelte'
  import AccountStats from '$lib/components/account/AccountStats.svelte'
  import PrizesCard from '$lib/components/account/PrizesCard.svelte'
  import Modal from '$lib/components/Modal.svelte'

  $: vaultBalance = $userBalances[lower(prizeVault.address)]
  $: isAccountSetupNecessary =
    !!vaultBalance && !!$userPrizeHookStatus && (!$userPrizeHookStatus.isPrizeHookSet || !$userPrizeHookStatus.isSwapperSet)
</script>

{#if isAccountSetupNecessary}
  <Modal title="Account Setup">
    <ConfigModalBanner slot="button-content" />
    <ConfigModalContent slot="modal-content" />
  </Modal>
{/if}

<AccountBalance />
<AccountStats />
<PrizesCard />
<AccountActions />
