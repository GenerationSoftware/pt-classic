<script>
  import { userAddress } from '$lib/stores'
</script>

{#if $userAddress}
  <div class="user-info">
    <!-- TODO: show ENS profile pic if resolved (default wallet/profile pic if not) -->
    <!-- TODO: show ENS if resolved -->
    <span>{$userAddress.slice(0, 6)}...{$userAddress.slice(-4)}</span>
  </div>
{:else}
  <span>Connect Wallet</span>
{/if}

<style>
  div.user-info {
    display: flex;
    align-items: center;
    gap: 1ch;
  }
</style>
