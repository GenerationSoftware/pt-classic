<script lang="ts">
  import { configurePrizeHook, getPrizeHookStatus, setPrizeHook } from '$lib/utils'
  import { userAddress, userPrizeHookStatus } from '$lib/stores'
  import ConfigActionItem from './ConfigActionItem.svelte'
  import Loading from '../Loading.svelte'

  export let onSuccess: () => void = () => {}
  let isConfiguringPrizeHook = false
  let isSettingPrizeHook = false

  const updateUserPrizeHookStatus = async () => {
    if (!!$userAddress) {
      const newPrizeHookStatus = await getPrizeHookStatus($userAddress)

      if (newPrizeHookStatus.isSwapperSet && newPrizeHookStatus.isPrizeHookSet) {
        onSuccess()
      }

      userPrizeHookStatus.set(newPrizeHookStatus)
    }
  }
</script>

{#if !!$userPrizeHookStatus}
  <p>
    Finish setting up your account to have the best possible prize experience with <strong>built-in prize compounding</strong>, while also
    <strong>voting to keep large prize sizes</strong>.
  </p>
  <ConfigActionItem
    action={() =>
      configurePrizeHook({
        onSend: () => {
          isConfiguringPrizeHook = true
        },
        onSuccess: () => {
          updateUserPrizeHookStatus()
        },
        onSettled: () => {
          isConfiguringPrizeHook = false
        }
      })}
    isDone={$userPrizeHookStatus.isSwapperSet}
    isDoing={isConfiguringPrizeHook}
  >
    <span slot="name-not-done">Configure Prize Hook</span>
    <span slot="name-done">Prize Hook Configured</span>
    <em slot="description">
      This transaction creates a "Swapper" contract that swaps and re-deposits your prizes for you. It also votes to keep prize sizes above
      a certain level.
    </em>
  </ConfigActionItem>
  <ConfigActionItem
    action={() =>
      setPrizeHook({
        onSend: () => {
          isSettingPrizeHook = true
        },
        onSuccess: () => {
          updateUserPrizeHookStatus()
        },
        onSettled: () => {
          isSettingPrizeHook = false
        }
      })}
    isDone={$userPrizeHookStatus.isPrizeHookSet}
    isDoing={isSettingPrizeHook}
  >
    <span slot="name-not-done">Enable Prize Hook</span>
    <span slot="name-done">Prize Hook Enabled</span>
    <em slot="description">This transaction lets the prize pool know to use your configured prize hook when you win a prize.</em>
  </ConfigActionItem>
{:else}
  <Loading />
{/if}

<style>
  p {
    text-align: left;
    margin-bottom: 0.5rem;
    color: var(--pt-purple-100);
  }
</style>
