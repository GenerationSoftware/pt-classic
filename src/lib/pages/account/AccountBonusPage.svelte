<script>
  import RewardsCard from '$lib/components/account/RewardsCard.svelte'
  import BackButton from '$lib/components/BackButton.svelte'
  import { router } from 'tinro'
</script>

<h2>Claim Bonus Rewards</h2>
<RewardsCard />
<BackButton onClick={() => router.goto('/account')} />

<style>
  h2 {
    text-align: center;
    margin-top: 1rem;
    padding: 0 1rem;
    font-size: 1.75rem;
    font-weight: 700;
    line-height: 150%;
  }
</style>
