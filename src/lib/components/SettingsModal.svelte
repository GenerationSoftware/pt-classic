<script lang="ts">
  import {
    compoundPrizes,
    disconnect,
    getPrizeHookStatus,
    rescueSwapperFunds,
    retireSwapper,
    unsetPrizeHook,
    updateUserTokenBalances
  } from '$lib/utils'
  import { clients, userAddress, userPrizeHookStatus } from '$lib/stores'
  import { formatUnits, type Address } from 'viem'
  import { prizePool } from '$lib/config'
  import SettingsActionItem from './SettingsActionItem.svelte'
  import Modal from './Modal.svelte'

  let closeModal: () => void

  $: pendingPrizeAmount = !!$userPrizeHookStatus?.isSwapperSet
    ? ($userPrizeHookStatus.swappersWithBalance.find((swapper) => swapper.address === $userPrizeHookStatus.swapperAddress)?.balance ?? 0n)
    : 0n

  $: retiredSwappersWithBalance = ($userPrizeHookStatus?.swappersWithBalance ?? []).filter(
    (swapper) => !$userPrizeHookStatus?.isSwapperSet || swapper.address !== $userPrizeHookStatus.swapperAddress
  )
  $: topRetiredSwapper = retiredSwappersWithBalance.sort((a, b) => {
    const x = b.balance - a.balance
    return x === 0n ? 0 : x > 0n ? 1 : -1
  })[0] as { address: Address; balance: bigint } | undefined

  const formatPrizeTokenAmount = (amount: bigint) => {
    return parseFloat(formatUnits(amount, prizePool.prizeToken.decimals)).toLocaleString('en', { maximumFractionDigits: 4 })
  }

  const updatePrizeHookStatus = async () => {
    if (!!$userAddress) {
      userPrizeHookStatus.set(await getPrizeHookStatus($userAddress))
    }
  }
</script>

<Modal title="Settings" buttonStyle="display: flex;" bind:close={closeModal}>
  <svg slot="button-content" viewBox="0 0 1000 1000" xmlns="http://www.w3.org/2000/svg">
    <glyph glyph-name="navigation-menu" unicode="&#xefa2;" horiz-adv-x="1000" />
    <path
      d="M62.5 221.7v24.400000000000006c0 37.900000000000006 30.700000000000003 68.6 68.6 68.6h737.6999999999999c37.90000000000009 0 68.60000000000002-30.69999999999999 68.60000000000002-68.6v-24.400000000000006c0-37.89999999999998-30.699999999999932-68.6-68.60000000000002-68.6h-737.6999999999999c-37.90000000000002 0-68.60000000000002 30.700000000000017-68.60000000000002 68.6z m68.6 359.40000000000003h737.6999999999999c37.90000000000009 0 68.60000000000002-30.700000000000045 68.60000000000002-68.60000000000002v-24.5c0-37.89999999999998-30.699999999999932-68.60000000000002-68.60000000000002-68.60000000000002h-737.6999999999999c-37.90000000000002 0-68.60000000000002 30.700000000000045-68.60000000000002 68.60000000000002v24.399999999999977c0 38 30.700000000000003 68.70000000000005 68.6 68.70000000000005z m0 266.29999999999995h737.6999999999999c37.90000000000009 0 68.60000000000002-30.699999999999932 68.60000000000002-68.60000000000002v-24.399999999999977c0-37.89999999999998-30.699999999999932-68.60000000000002-68.60000000000002-68.60000000000002h-737.6999999999999c-37.90000000000002 0-68.60000000000002 30.700000000000045-68.60000000000002 68.60000000000002v24.399999999999977c0 37.90000000000009 30.700000000000003 68.60000000000002 68.6 68.60000000000002z"
    />
  </svg>
  <div slot="modal-content" class="content-wrapper">
    <SettingsActionItem
      action={() => {
        closeModal()
        disconnect()
      }}
      disabled={!$clients.wallet}
      disabledReason="No currently connected wallet."
    >
      Disconnect Wallet
    </SettingsActionItem>
    <SettingsActionItem
      action={() => unsetPrizeHook({ onSuccess: updatePrizeHookStatus })}
      disabled={!$userPrizeHookStatus?.isPrizeHookSet}
      disabledReason="No prize hook enabled."
    >
      Disable Prize Hook
    </SettingsActionItem>
    <SettingsActionItem
      action={() =>
        compoundPrizes({
          onSuccess: () => {
            updatePrizeHookStatus()
            !!$userAddress && updateUserTokenBalances($userAddress)
          }
        })}
      disabled={!pendingPrizeAmount}
      disabledReason="No pending prizes to compound."
    >
      Compound Pending Prizes{!!pendingPrizeAmount ? ` (${formatPrizeTokenAmount(pendingPrizeAmount)} ${prizePool.prizeToken.symbol})` : ''}
    </SettingsActionItem>
    <SettingsActionItem
      action={() => retireSwapper({ onSuccess: updatePrizeHookStatus })}
      disabled={!$userPrizeHookStatus?.isSwapperSet}
      disabledReason="No active/configured swapper."
    >
      Retire Swapper
    </SettingsActionItem>
    <SettingsActionItem
      action={() => !!topRetiredSwapper && rescueSwapperFunds(topRetiredSwapper, { onSuccess: updatePrizeHookStatus })}
      disabled={!topRetiredSwapper}
      disabledReason={!$userPrizeHookStatus?.pastSwapperAddresses.length
        ? 'No retired swappers.'
        : 'No funds to rescue in retired swappers.'}
    >
      Rescue Funds From Retired Swappers{!!topRetiredSwapper
        ? ` (${formatPrizeTokenAmount(topRetiredSwapper?.balance ?? 0n)} ${prizePool.prizeToken.symbol})`
        : ''}
    </SettingsActionItem>
  </div>
</Modal>

<style>
  svg {
    height: 1.25rem;
  }

  svg > path {
    fill: var(--pt-purple-50);
  }

  svg:hover > path {
    fill: var(--pt-purple-200);
  }

  div.content-wrapper {
    min-width: 15rem;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }
</style>
