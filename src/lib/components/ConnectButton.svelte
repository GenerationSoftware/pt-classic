<script>
  import { connect as _connect, disconnect as _disconnect, getWalletClient, injected } from '@wagmi/core'
  import { userAddress, walletClient } from '$lib/stores'
  import { wagmiConfig } from '$lib/constants'
  import { base } from 'viem/chains'
  import Loading from './Loading.svelte'

  const connect = async () => {
    await _connect(wagmiConfig, { chainId: base.id, connector: injected() })
    walletClient.set(await getWalletClient(wagmiConfig))
  }

  const disconnect = async () => {
    await _disconnect(wagmiConfig)
    walletClient.set(undefined)
  }

  // TODO: ens resolution
  // TODO: ens avatar resolution
</script>

{#if !!$walletClient}
  <div class="connected">
    {#if !!$userAddress}
      <span>{$userAddress.slice(0, 6)}...{$userAddress.slice(-4)}</span>
    {:else}
      <Loading height="0.5rem" />
    {/if}
    <button id="disconnect" on:click={disconnect}>
      <svg height="1.1rem" width="1.1rem" fill="#f5f0ff" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30.143 30.143">
        <path
          d="M20.034,2.357v3.824c3.482,1.798,5.869,5.427,5.869,9.619c0,5.98-4.848,10.83-10.828,10.83
		c-5.982,0-10.832-4.85-10.832-10.83c0-3.844,2.012-7.215,5.029-9.136V2.689C4.245,4.918,0.731,9.945,0.731,15.801
		c0,7.921,6.42,14.342,14.34,14.342c7.924,0,14.342-6.421,14.342-14.342C29.412,9.624,25.501,4.379,20.034,2.357z"
        />
        <path
          d="M14.795,17.652c1.576,0,1.736-0.931,1.736-2.076V2.08c0-1.148-0.16-2.08-1.736-2.08
		c-1.57,0-1.732,0.932-1.732,2.08v13.496C13.062,16.722,13.225,17.652,14.795,17.652z"
        />
      </svg>
    </button>
  </div>
{:else}
  <button id="connect" on:click={connect}>Connect Wallet</button>
{/if}

<style>
  div.connected {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  button#disconnect {
    margin-top: 0.2rem;
  }
</style>
