<script lang="ts">
	// Variant E — Editorial: two wide split cards per row, large side thumbnail.
	import CardActions from './CardActions.svelte';
	import { Badge } from '$lib/components/ui/badge/index.js';
	import { fallbackLetter, hostname, type VariantProps } from './data.js';

	let { items, onToggleFavorite, onEdit, onDelete }: VariantProps = $props();
</script>

<div class="grid gap-4 lg:grid-cols-2">
	{#each items as b (b.id)}
		<article
			class="relative flex gap-4 rounded-xl bg-card p-4 text-card-foreground ring-1 ring-foreground/10"
		>
			<div class="relative size-28 shrink-0 overflow-hidden rounded-lg bg-muted sm:size-36">
				{#if b.image}
					<img src={b.image.url} alt="" class="size-full object-cover" />
				{:else}
					<div class="grid size-full place-items-center">
						<span class="text-4xl font-semibold text-muted-foreground">
							{fallbackLetter(b.title)}
						</span>
					</div>
				{/if}
			</div>

			<div class="flex min-w-0 flex-1 flex-col gap-1">
				<a
					href={b.url}
					target="_blank"
					rel="external noreferrer"
					class="font-medium after:absolute after:inset-0"
				>
					{b.title}
				</a>
				<p class="text-xs text-muted-foreground">{hostname(b.url)}</p>
				<p class="line-clamp-2 text-sm text-muted-foreground">{b.description}</p>

				<div class="mt-auto flex items-center justify-between gap-2 pt-2">
					<div class="flex flex-wrap gap-1">
						{#each b.tags as t (t)}
							<Badge variant="secondary">{t}</Badge>
						{/each}
					</div>
					<CardActions bookmark={b} {onToggleFavorite} {onEdit} {onDelete} />
				</div>
			</div>
		</article>
	{/each}
</div>
