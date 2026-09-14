<script lang="ts">
	// View mode: Grid — dense 4-column grid, square thumbnails, tags as plain text.
	import CardActions from './CardActions.svelte';
	import { fallbackLetter, type ViewProps } from './data.js';

	let { items, onToggleFavorite, onEdit, onDelete }: ViewProps = $props();
</script>

<div class="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-4">
	{#each items as b (b.id)}
		<article
			class="relative flex flex-col overflow-hidden rounded-xl bg-card text-card-foreground ring-1 ring-foreground/10"
		>
			<div class="relative">
				{#if b.image}
					<img src={b.image.url} alt="" class="aspect-square w-full object-cover" />
				{:else}
					<div class="grid aspect-square w-full place-items-center bg-muted">
						<span class="text-3xl font-semibold text-muted-foreground">
							{fallbackLetter(b.title)}
						</span>
					</div>
				{/if}

				<div class="absolute top-1.5 right-1.5">
					<CardActions bookmark={b} overlay {onToggleFavorite} {onEdit} {onDelete} />
				</div>
			</div>

			<div class="flex flex-1 flex-col gap-1 p-2.5">
				<a
					href={b.url}
					target="_blank"
					rel="external noreferrer"
					class="text-sm font-medium after:absolute after:inset-0"
				>
					{b.title}
				</a>
				<p class="truncate text-xs text-muted-foreground">{b.tags.join(' · ')}</p>
			</div>
		</article>
	{/each}
</div>
