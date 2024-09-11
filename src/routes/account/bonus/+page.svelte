<script>
  import { goto } from '$app/navigation'
  import BackButton from '$lib/components/BackButton.svelte'
</script>

<!-- TODO: how bonus rewards available to be claimed -->
<!-- TODO: button to claim and zap into prize vault -->
<!-- TODO: button to just claim -->

<span>WE BUIDLING</span>
<BackButton onClick={() => goto('/account')} />
