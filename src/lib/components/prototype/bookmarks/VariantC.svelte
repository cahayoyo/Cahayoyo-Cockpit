<script lang="ts">
	// Variant C — Rows: dense list-hybrid, one row per bookmark, maximum density.
	import CardActions from './CardActions.svelte';
	import { Badge } from '$lib/components/ui/badge/index.js';
	import { fallbackLetter, hostname, type VariantProps } from './data.js';

	let { items, onToggleFavorite, onEdit, onDelete }: VariantProps = $props();
</script>

<div
	class="divide-y divide-border overflow-hidden rounded-xl bg-card text-card-foreground ring-1 ring-foreground/10"
>
	{#each items as b (b.id)}
		<div class="relative flex items-center gap-3 p-2.5">
			{#if b.image}
				<img src={b.image.url} alt="" class="size-14 shrink-0 rounded-lg object-cover" />
			{:else}
				<div class="grid size-14 shrink-0 place-items-center rounded-lg bg-muted">
					<span class="text-lg font-semibold text-muted-foreground">{fallbackLetter(b.title)}</span>
				</div>
			{/if}

			<div class="min-w-0 flex-1">
				<a
					href={b.url}
					target="_blank"
					rel="external noreferrer"
					class="font-medium after:absolute after:inset-0"
				>
					{b.title}
				</a>
				<p class="truncate text-xs text-muted-foreground">
					{hostname(b.url)}{b.description ? ` — ${b.description}` : ''}
				</p>
			</div>

			<div class="hidden shrink-0 flex-wrap justify-end gap-1 lg:flex">
				{#each b.tags as t (t)}
					<Badge variant="secondary">{t}</Badge>
				{/each}
			</div>

			<CardActions bookmark={b} {onToggleFavorite} {onEdit} {onDelete} />
		</div>
	{/each}
</div>
