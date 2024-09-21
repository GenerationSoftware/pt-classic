<script>
  import DepositCard from '$lib/components/deposit/DepositCard.svelte'
</script>

<div class="banner">
  <span class="img-wrapper" />
  <!-- TODO: query amount in prize pool, "save and win up to $X" (color amount pink) -->
  <span class="title">Save & win big, no losses</span>
</div>

<span class="pt-info">Participate in daily PoolTogether prize draws</span>

<DepositCard />

<!-- TODO: query a more exact value (color it pink :3) -->
<span class="join-us">Join the thousands of people saving to win</span>

<style>
  div.banner {
    position: relative;
    width: calc(100% - 4rem);
    display: flex;
    justify-content: center;
    text-align: center;
    padding: 1rem;
    border-radius: 1rem;
    overflow: hidden;
    isolation: isolate;
  }

  div.banner > span.title {
    padding: 0.25rem 0;
    font-size: 1.75rem;
    font-weight: 700;
  }

  div.banner > span.img-wrapper {
    position: absolute;
    inset: 0;
    padding-top: 42vw;
    background-image: url('/abstract-pooly.jpg');
    background-repeat: no-repeat;
    background-position-y: center;
    background-size: cover;
    z-index: -10;
  }

  div.banner > span.img-wrapper::after {
    content: '';
    position: absolute;
    inset: 0;
    background-color: rgba(69, 35, 139, 0.8);
  }

  span.pt-info {
    font-size: 0.875rem;
    color: var(--pt-purple-200);
  }

  span.join-us {
    width: calc(100% - 2rem);
    text-align: center;
    margin-top: calc(1em - 1rem);
    font-size: 1.75rem;
    font-weight: 600;
    color: var(--pt-purple-200);
  }

  @media (min-width: 48rem) {
    div.banner {
      width: 32rem;
    }

    div.banner > span.img-wrapper {
      padding-top: 16rem;
    }
  }
</style>
