<script>
  import { userAddress } from '$lib/stores'
</script>

{#if $userAddress}
  <!-- TODO: show ENS if resolved -->
  <!-- TODO: show ENS profile pic if resolved -->
  <!-- TODO: have dropdown to disconnect -->
  <span>{$userAddress}</span>
{:else}
  <span class="teal-button">Connect Wallet</span>
{/if}
