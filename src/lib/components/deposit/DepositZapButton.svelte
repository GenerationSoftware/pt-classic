<script lang="ts">
  import { approve, depositZap, getTokenPrice, lower, updateUserTokenBalances, updateUserTransferEvents } from '$lib/utils'
  import { clients, tokenPrices, userAddress, userTransferEvents } from '$lib/stores'
  import { formatUnits, parseUnits } from 'viem/utils'
  import { dolphinAddress } from '$lib/constants'
  import { erc20Abi, type Address } from 'viem'
  import { chain, prizeVault } from '$lib/config'
  import { zapRouter } from 'dskit-eth'
  import { vaultABI } from '$lib/abis'
  import type { Token } from '$lib/types'
  import WalletConnectionModal from '../WalletConnectionModal.svelte'
  import Loading from '../Loading.svelte'

  export let amount: bigint
  export let token: Token
  export let disabled: boolean = false
  export let onSuccess: (amount: bigint) => void = () => {}
  let allowance: bigint | undefined = undefined
  let isApproving: boolean = false
  let isDepositing: boolean = false

  $: getTokenPrice(token)
  $: tokenPrice = $tokenPrices[lower(token.address)] as number | undefined
  $: minAmountOut =
    tokenPrice !== undefined
      ? parseUnits(`${tokenPrice * parseFloat(formatUnits(amount, token.decimals)) * 0.95}`, prizeVault.decimals)
      : undefined

  const updateAllowance = async (spenderAddress: Address) => {
    if (!!$userAddress && token.address !== dolphinAddress) {
      allowance = await $clients.public.readContract({
        address: token.address,
        abi: erc20Abi,
        functionName: 'allowance',
        args: [$userAddress, spenderAddress]
      })
    }
  }
</script>

{#if !$clients.wallet || !$userAddress}
  <WalletConnectionModal>
    <div slot="button-content" class="teal-button">Connect Wallet</div>
  </WalletConnectionModal>
{:else if !amount}
  <button class="teal-button" disabled={true}>Deposit</button>
{:else if minAmountOut === undefined}
  <button class="teal-button" disabled={true}>
    <Loading height=".75rem" />
  </button>
{:else if minAmountOut === 0n}
  <button class="teal-button" disabled={true}>No price data found for {token.symbol}</button>
{:else}
  {@const zapPromise = $clients.dskit.zap
    .tx({
      tokenIn: { ...token, amount },
      swapTo: prizeVault.asset,
      action: {
        address: prizeVault.address,
        abi: vaultABI,
        functionName: 'deposit',
        args: [amount, zapRouter[chain.id]],
        injectedAmountIndex: 4
      },
      tokenOut: { address: prizeVault.address, minAmount: minAmountOut },
      userAddress: $userAddress
    })
    .then(async (zapTx) => {
      !!zapTx.approval && (await updateAllowance(zapTx.approval.spender))
      return zapTx
    })}

  {#await zapPromise}
    <button class="teal-button" disabled={true}>
      <Loading height=".75rem" />
    </button>
  {:then zapTx}
    {#if !!zapTx.approval && (!allowance || (allowance !== undefined && allowance < amount))}
      {@const spender = zapTx.approval.spender}

      <button
        type="submit"
        on:click={() =>
          approve(token.address, spender, amount, {
            onSend: () => {
              isApproving = true
            },
            onSettled: () => {
              isApproving = false
              updateAllowance(spender)
            }
          })}
        class="teal-button"
        disabled={isApproving || disabled}
      >
        {#if isApproving}
          <Loading height=".75rem" />
        {:else}
          Approve
        {/if}
      </button>
    {:else}
      <button
        type="submit"
        on:click={() =>
          depositZap(zapTx.request, {
            onSend: () => {
              isDepositing = true
            },
            onSuccess: (_t, depositEvent) => {
              updateUserTransferEvents($userAddress, $userTransferEvents ?? [])
              onSuccess(depositEvent.args.assets)
            },
            onSettled: () => {
              isDepositing = false
              !!zapTx.approval && updateAllowance(zapTx.approval.spender)
              updateUserTokenBalances($userAddress, [dolphinAddress, prizeVault.address, prizeVault.asset.address, token.address])
            }
          })}
        class="teal-button"
        disabled={isDepositing || disabled}
      >
        {#if isDepositing}
          <Loading height=".75rem" />
        {:else}
          Deposit
        {/if}
      </button>
    {/if}
  {:catch}
    <button class="teal-button" disabled={true}>No swap route found for {token.symbol} -> {prizeVault.asset.symbol}</button>
  {/await}
{/if}
