<script lang="ts">
  import { userAddress, userBalances, userTransferEvents, walletClient } from '$lib/stores'
  import { approve, deposit, getTokenBalances, getTransferEvents } from '$lib/utils'
  import { publicClient } from '$lib/constants'
  import { prizeVault } from '$lib/config'
  import { erc20Abi } from 'viem'

  export let amount: bigint
  export let disabled: boolean = false
  export let onSuccess: (amount: bigint) => void = () => {}
  let allowance: bigint | undefined = undefined
  let isApproving: boolean = false
  let isDepositing: boolean = false

  const updateAllowance = async () => {
    if (!!$userAddress) {
      allowance = await publicClient.readContract({
        address: prizeVault.asset.address,
        abi: erc20Abi,
        functionName: 'allowance',
        args: [$userAddress, prizeVault.address]
      })
    }
  }

  $: $userAddress, updateAllowance()

  const updateBalances = async () => {
    if (!!$userAddress) {
      const updatedBalances = await getTokenBalances($userAddress, [prizeVault.address, prizeVault.asset.address])
      userBalances.update((oldBalances) => ({ ...oldBalances, ...updatedBalances }))
    }
  }

  const updateTransferEvents = async () => {
    if (!!$userTransferEvents && !!$userAddress) {
      const lastTransferEvent = $userTransferEvents.at(-1)
      const newTransferEvents = await getTransferEvents($userAddress, prizeVault.address, {
        fromBlock: !!lastTransferEvent ? lastTransferEvent.blockNumber + 1n : undefined
      })
      userTransferEvents.update((oldTransferEvents) => [...(oldTransferEvents ?? []), ...newTransferEvents])
    }
  }
</script>

{#if !$walletClient || !$userAddress || !amount || allowance === undefined}
  <button class="teal-button" disabled={true}>Deposit</button>
{:else if allowance < amount}
  <button
    type="submit"
    on:click={() =>
      approve(prizeVault.asset.address, prizeVault.address, amount, {
        onSend: () => {
          isApproving = true
        },
        onSettled: () => {
          isApproving = false
          updateAllowance()
        }
      })}
    class="teal-button"
    disabled={isApproving || disabled}>Approve</button
  >
{:else}
  <button
    type="submit"
    on:click={() =>
      deposit(amount, {
        onSend: () => {
          isDepositing = true
        },
        onSuccess: (_t, depositEvent) => {
          updateTransferEvents()
          onSuccess(depositEvent.args.assets)
        },
        onSettled: () => {
          isDepositing = false
          updateAllowance()
          updateBalances()
        }
      })}
    class="teal-button"
    disabled={isDepositing || disabled}>Deposit</button
  >
{/if}
