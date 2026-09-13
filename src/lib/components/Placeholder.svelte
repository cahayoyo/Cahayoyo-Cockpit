<script lang="ts">
	import type { Component } from 'svelte';

	let {
		icon: Icon,
		description,
		note
	}: {
		icon: Component;
		description: string;
		note?: string;
	} = $props();
</script>

<div class="flex items-start gap-3 rounded-lg border border-border p-6">
	<Icon class="size-6 shrink-0 text-muted-foreground" />
	<div class="space-y-1">
		<p class="text-sm text-muted-foreground">{description}</p>
		{#if note}
			<p class="text-xs text-muted-foreground">{note}</p>
		{/if}
	</div>
</div>
