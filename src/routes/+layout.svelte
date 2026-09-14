<script lang="ts">
	import '../app.css';
	import { ModeWatcher } from 'mode-watcher';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href="/logo/cahayoyo-mark.png" />
</svelte:head>

<ModeWatcher disableTransitions={false} />
{@render children()}
