<script>
  import BackButton from '$lib/components/BackButton.svelte'
  import { router } from 'tinro'
</script>

<!-- TODO: how bonus rewards available to be claimed -->
<!-- TODO: button to claim and zap into prize vault -->
<!-- TODO: button to just claim -->

<span>WE BUIDLING</span>
<BackButton onClick={() => router.goto('/account')} />
