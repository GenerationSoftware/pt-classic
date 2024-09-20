<script>
  import { walletProviders } from '$lib/stores'
  import { connect } from '$lib/utils'
</script>

<!-- TODO: style -->

{#if $walletProviders.length == 0}
  <h4>No wallet providers found...</h4>
{:else}
  <h4>Discovered wallets...</h4>
  <div id="providers">
    {#each $walletProviders as provider}
      <button class="connect-btn" on:click={() => connect(provider)}>
        {#if !!provider.info.icon}
          <img src={provider.info.icon} alt="" />
        {/if}
        <span>{provider.info.name}</span>
      </button>
    {/each}
  </div>
{/if}
