<script lang="ts">
  import { getEnsAvatar, getEnsName } from '$lib/utils'
  import { userAddress } from '$lib/stores'
  import type { Address } from 'viem'

  let user: { address: Address; name: string | null; avatar: string | null } | undefined

  const getUserEnsInfo = async (address?: Address) => {
    if (!address) {
      user = undefined
    } else if (!user || address !== user.address) {
      user = { address, name: null, avatar: null }

      user.name = await getEnsName(address)

      if (!!user.name) {
        user.avatar = await getEnsAvatar(user.name)
      }
    }
  }

  $: getUserEnsInfo($userAddress)
</script>

<!-- TODO: display wrong network icon and switch networks on click -->

{#if $userAddress}
  {@const displayName = user?.name ?? `${$userAddress.slice(0, 6)}...${$userAddress.slice(-4)}`}

  <div class="user-info">
    {#if !!user?.avatar}
      <img src={user.avatar} alt="Avatar" />
    {:else}
      <svg viewBox="0 0 1000 1000" xmlns="http://www.w3.org/2000/svg">
        <glyph glyph-name="user" unicode="&#xed05;" horiz-adv-x="1000" />
        <path
          fill="#24095b"
          d="M670.4 460c-5.199999999999932-1.5-10.5-2.8000000000000114-15.699999999999932-4-44.80000000000007 28.100000000000023-97.80000000000007 44.39999999999998-154.60000000000002 44.39999999999998-57.5 0-111.10000000000002-16.69999999999999-156.3-45.5-118.20000000000002 26.100000000000023-208 135.20000000000005-210.8 252.60000000000002-1.5 61.89999999999998-2.8000000000000114 123.79999999999995-2.8000000000000114 185.70000000000005-0.09999999999999432 57.69999999999993-4.299999999999983 59.299999999999955 25.30000000000001 67.19999999999993 0.09999999999999432 0 379 88.39999999999998 689.4 0.8000000000000682 16.399999999999977-6.7000000000000455 25.700000000000045-15 25.300000000000068-35.200000000000045-1.400000000000091-71.39999999999998 1.2999999999999545-142.79999999999995-1.5-214.10000000000002-4.5-119.19999999999993-83-219.7-198.30000000000007-251.89999999999998z m-168.59999999999997-26.80000000000001c118.49999999999994-1.6999999999999886 214.40000000000003-98.59999999999997 214.49999999999994-216.79999999999998 0.10000000000002274-119.9-94.5-215.70000000000002-213.49999999999994-216.4-120.90000000000003-0.7-219.3 95.7-219.90000000000003 215.4-0.5999999999999659 118.29999999999998 101.10000000000002 219.49999999999997 218.90000000000003 217.79999999999998z"
        />
      </svg>
    {/if}
    <span>{displayName}</span>
  </div>
{:else}
  <span class="connect-button">Connect Wallet</span>
{/if}

<style>
  div.user-info {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  div.user-info > img {
    height: 1.4rem;
  }

  div.user-info > svg {
    height: 1rem;
    padding: 0.2rem;
    background-color: var(--pt-purple-50);
    border-radius: 50%;
  }

  div.user-info:hover > svg {
    background-color: var(--pt-purple-200);
  }

  div.user-info > span {
    max-width: 50vw;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  div.user-info:hover > span {
    color: var(--pt-purple-200);
  }

  span.connect-button {
    padding: 0.5rem 0.75rem;
    font-size: 0.75rem;
    font-weight: 500;
    color: var(--pt-purple-100);
    background-color: var(--pt-transparent);
    border: 1px solid var(--pt-transparent);
    border-radius: 0.5rem;
    line-height: 150%;
  }

  span.connect-button:hover {
    background-color: rgba(245, 240, 255, 0.15);
  }
</style>
