<script lang="ts">
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

  let closeConfigModal: () => void

  $: vaultBalance = $userBalances[lower(prizeVault.address)]
  $: isAccountSetupNecessary =
    !!vaultBalance && !!$userPrizeHookStatus && (!$userPrizeHookStatus.isPrizeHookSet || !$userPrizeHookStatus.isSwapperSet)
</script>

{#if isAccountSetupNecessary}
  <Modal title="Account Setup" bind:close={closeConfigModal}>
    <ConfigModalBanner slot="button-content" animate={true} />
    <ConfigModalContent slot="modal-content" onSuccess={closeConfigModal} />
  </Modal>
{/if}

<AccountBalance />
<AccountStats />
<PrizesCard />
<AccountActions />
