<script lang="ts">
	// Variant A — Showcase: image-forward 3-column grid, roomy cards.
	import CardActions from './CardActions.svelte';
	import { Badge } from '$lib/components/ui/badge/index.js';
	import { fallbackLetter, hostname, type VariantProps } from './data.js';

	let { items, onToggleFavorite, onEdit, onDelete }: VariantProps = $props();
</script>

<div class="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
	{#each items as b (b.id)}
		<article
			class="group relative flex flex-col overflow-hidden rounded-xl bg-card text-card-foreground ring-1 ring-foreground/10"
		>
			<div class="relative">
				{#if b.image}
					<img src={b.image.url} alt="" class="aspect-video w-full object-cover" />
				{:else}
					<div class="grid aspect-video w-full place-items-center bg-muted">
						<span class="text-4xl font-semibold text-muted-foreground">
							{fallbackLetter(b.title)}
						</span>
					</div>
				{/if}

				<div class="absolute top-2 right-2 flex gap-1">
					<CardActions bookmark={b} overlay {onToggleFavorite} {onEdit} {onDelete} />
				</div>
			</div>

			<div class="flex flex-1 flex-col gap-2 p-4">
				<a
					href={b.url}
					target="_blank"
					rel="external noreferrer"
					class="font-medium after:absolute after:inset-0"
				>
					{b.title}
				</a>
				<p class="line-clamp-2 text-sm text-muted-foreground">{b.description}</p>
				<div class="mt-auto flex items-center justify-between gap-2 pt-2">
					<div class="flex flex-wrap gap-1">
						{#each b.tags as t (t)}
							<Badge variant="secondary">{t}</Badge>
						{/each}
					</div>
					<span class="shrink-0 text-xs text-muted-foreground">{hostname(b.url)}</span>
				</div>
			</div>
		</article>
	{/each}
</div>
