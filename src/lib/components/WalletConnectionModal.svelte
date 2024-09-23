<script lang="ts">
  import { clients, lastConnectedProviderId, walletProviders } from '$lib/stores'
  import { connect } from '$lib/utils'
  import Modal from './Modal.svelte'

  let closeModal: () => void
</script>

<Modal title="Wallets" bind:close={closeModal}>
  <slot name="button-content" slot="button-content" />
  <div slot="modal-content" class="content-wrapper">
    {#if $walletProviders.length > 0}
      <div class="providers">
        {#each $walletProviders as provider}
          {@const isConnected = !!$clients.wallet && !!$lastConnectedProviderId && $lastConnectedProviderId === provider.info.uuid}

          <button on:click={!isConnected ? () => connect(provider, { onConnected: closeModal }) : undefined}>
            {#if !!provider.info.icon}
              <img src={provider.info.icon} alt={provider.info.name} />
            {:else}
              <svg viewBox="0 0 1000 1000" xmlns="http://www.w3.org/2000/svg">
                <glyph glyph-name="wallet" unicode="&#xf024;" horiz-adv-x="1000" />
                <path
                  fill="#24095b"
                  d="M484.7 396.2v-19.80000000000001c0-64.19999999999999 52.00000000000006-116.29999999999995 116.30000000000001-116.29999999999995h283.5v-34.30000000000001c0-29.900000000000006-24.399999999999977-54.30000000000001-54.200000000000045-54.30000000000001h-713.5999999999999c-29.80000000000004 0-54.200000000000045 24.400000000000006-54.200000000000045 54.30000000000001v548.7c0 29.899999999999977 24.400000000000006 54.299999999999955 54.2 54.299999999999955h713.5999999999999c29.800000000000068 0 54.200000000000045-24.399999999999977 54.200000000000045-54.299999999999955v-262h-283.5c-64.29999999999995 0-116.30000000000001-52-116.30000000000001-116.30000000000001z m412.09999999999997-107.69999999999999h-278.69999999999993c-49.80000000000007 0-90.10000000000002 40.30000000000001-90.10000000000002 90.10000000000002v15.299999999999955c0 49.80000000000001 40.299999999999955 90.10000000000002 90.10000000000002 90.10000000000002h278.69999999999993c22.5 0 40.700000000000045-18.19999999999999 40.700000000000045-40.69999999999999v-114.10000000000002c0-22.5-18.200000000000045-40.69999999999999-40.700000000000045-40.69999999999999z m-263.9 145.7c-26.5 0-47.89999999999998-21.399999999999977-47.89999999999998-47.89999999999998s21.399999999999977-47.900000000000034 47.89999999999998-47.900000000000034 47.89999999999998 21.400000000000034 47.89999999999998 47.900000000000034c0 26.399999999999977-21.399999999999977 47.89999999999998-47.89999999999998 47.89999999999998z"
                />
              </svg>
            {/if}
            <span class="provider-name">{provider.info.name}</span>
            {#if isConnected}
              <span class="connected">Connected</span>
            {/if}
          </button>
        {/each}
      </div>
    {:else}
      <em>No wallet providers found...</em>
    {/if}
  </div>
</Modal>

<style>
  div.content-wrapper {
    min-width: 15rem;
    text-align: center;
  }

  div.providers {
    display: flex;
    flex-direction: column;
    align-items: start;
    gap: 1rem;
  }

  div.providers > button {
    width: 100%;
    display: flex;
    align-items: center;
    gap: 1ch;
    padding: 0.5rem 0.75rem;
    color: var(--pt-purple-50);
    background-color: var(--pt-purple-500);
    border-radius: 0.5rem;
  }

  div.providers > button > img {
    height: 1.6rem;
    border-radius: 0.5rem;
  }

  div.providers > button > svg {
    height: 1.2rem;
    padding: 0.2rem;
    background-color: var(--pt-purple-600);
    border-radius: 0.5rem;
  }

  span.connected {
    margin-left: auto;
    padding: 0.2rem 0.3rem;
    font-size: 0.875rem;
    font-weight: 500;
    color: var(--pt-purple-800);
    background-color: var(--pt-teal-light);
    border-radius: 0.25rem;
  }

  em {
    color: var(--pt-purple-100);
  }
</style>
