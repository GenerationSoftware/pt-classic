<script>
  import BackButton from '$lib/components/BackButton.svelte'
  import { router } from 'tinro'
</script>

<!-- TODO: plinko game to check wins -->
<!-- TODO: show prizes won -->

<span>WE BUIDLING</span>
<BackButton onClick={() => router.goto('/account')} />
