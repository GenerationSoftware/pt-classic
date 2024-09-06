<script lang="ts">
  import { userAddress, userBalances, walletClient } from '$lib/stores'
  import { chain, prizeVault } from '$lib/config'
  import { getTokenBalances } from '$lib/utils'
  import { publicClient } from '$lib/constants'
  import { vaultABI } from '$lib/abis/vaultABI'

  export let amount: bigint
  export let disabled: boolean = false
  export let onSuccess: () => void = () => {}
  let isWithdrawing: boolean = false

  const updateBalances = async () => {
    if (!!$userAddress) {
      const updatedBalances = await getTokenBalances($userAddress, [prizeVault.address, prizeVault.asset.address])
      userBalances.update((oldBalances) => ({ ...oldBalances, ...updatedBalances }))
    }
  }

  const withdraw = async () => {
    if (!!$walletClient && !!$userAddress) {
      try {
        isWithdrawing = true
        const hash = await $walletClient.writeContract({
          chain,
          account: $userAddress,
          address: prizeVault.address,
          abi: vaultABI,
          functionName: 'redeem',
          args: [amount, $userAddress, $userAddress, amount]
        })
        const txReceipt = await publicClient.waitForTransactionReceipt({ hash })

        if (txReceipt.status === 'success') {
          onSuccess()
        } else {
          throw new Error(`redeem tx reverted: ${hash}`)
        }
      } catch (e) {
        console.error(e)
      } finally {
        isWithdrawing = false
        updateBalances()
      }
    }
  }
</script>

{#if !$walletClient || !$userAddress || !amount}
  <button disabled={true}>Withdraw</button>
{:else}
  <button type="submit" on:click={withdraw} disabled={isWithdrawing || disabled}>Withdraw</button>
{/if}
