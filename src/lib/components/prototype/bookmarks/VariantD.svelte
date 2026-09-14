<script lang="ts">
	// Variant D — Tiles: image-as-surface, title overlaid on the image, no separate content block.
	import CardActions from './CardActions.svelte';
	import { fallbackLetter, hostname, type VariantProps } from './data.js';

	let { items, onToggleFavorite, onEdit, onDelete }: VariantProps = $props();
</script>

<div class="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
	{#each items as b (b.id)}
		<article
			class="relative aspect-video overflow-hidden rounded-xl bg-muted ring-1 ring-foreground/10"
		>
			{#if b.image}
				<img src={b.image.url} alt="" class="absolute inset-0 size-full object-cover" />
			{:else}
				<div class="absolute inset-0 grid place-items-center">
					<span class="text-5xl font-semibold text-muted-foreground">{fallbackLetter(b.title)}</span
					>
				</div>
			{/if}

			<div class="absolute top-2 right-2">
				<CardActions
					bookmark={b}
					overlay={Boolean(b.image)}
					{onToggleFavorite}
					{onEdit}
					{onDelete}
				/>
			</div>

			<div class="absolute inset-x-0 bottom-0 flex flex-col bg-foreground/70 p-3 text-background">
				<a
					href={b.url}
					target="_blank"
					rel="external noreferrer"
					class="font-medium after:absolute after:inset-0"
				>
					{b.title}
				</a>
				<p class="truncate text-xs opacity-80">{hostname(b.url)} · {b.tags.join(', ')}</p>
			</div>
		</article>
	{/each}
</div>
