<script lang="ts">
	// PROTOTYPE (branch `prototype/bookmarks`) — 5 card-grid variants behind `?variant=`.
	// Replace the real page on this branch only; nothing here ships.
	import SearchX from '@lucide/svelte/icons/search-x';
	import { page } from '$app/state';
	import PrototypeSwitcher from '$lib/components/prototype/PrototypeSwitcher.svelte';
	import BookmarkEditorDialog from '$lib/components/prototype/bookmarks/BookmarkEditorDialog.svelte';
	import Toolbar from '$lib/components/prototype/bookmarks/Toolbar.svelte';
	import VariantA from '$lib/components/prototype/bookmarks/VariantA.svelte';
	import VariantB from '$lib/components/prototype/bookmarks/VariantB.svelte';
	import VariantC from '$lib/components/prototype/bookmarks/VariantC.svelte';
	import VariantD from '$lib/components/prototype/bookmarks/VariantD.svelte';
	import VariantE from '$lib/components/prototype/bookmarks/VariantE.svelte';
	import {
		ALL_TAGS,
		BOOKMARKS,
		MEDIA,
		filterBookmarks,
		withImages,
		type PrototypeBookmark,
		type PrototypeMedia,
		type SortKey
	} from '$lib/components/prototype/bookmarks/data.js';
	import { Button } from '$lib/components/ui/button/index.js';

	const VARIANTS = [
		{ key: 'a', name: 'Showcase grid', component: VariantA },
		{ key: 'b', name: 'Compact grid', component: VariantB },
		{ key: 'c', name: 'Dense rows', component: VariantC },
		{ key: 'd', name: 'Image tiles', component: VariantD },
		{ key: 'e', name: 'Editorial split', component: VariantE }
	];

	let bookmarks = $state<PrototypeBookmark[]>(structuredClone(BOOKMARKS));
	let media = $state<PrototypeMedia[]>(structuredClone(MEDIA));

	let q = $state('');
	let favorite = $state(false);
	let tag = $state('all');
	let sort = $state('newest');

	let editorOpen = $state(false);
	let editing = $state<PrototypeBookmark | null>(null);

	const sortKey = $derived<SortKey>(sort === 'title' ? 'title' : 'newest');
	const items = $derived(withImages(filterBookmarks(bookmarks, q, favorite, tag, sortKey), media));
	const usage = $derived((id: string) => bookmarks.filter((b) => b.imageId === id).length);

	const variantKey = $derived(page.url.searchParams.get('variant') ?? VARIANTS[0].key);
	const variant = $derived(VARIANTS.find((v) => v.key === variantKey) ?? VARIANTS[0]);

	function openCreate(): void {
		editing = null;
		editorOpen = true;
	}

	function openEdit(bookmark: PrototypeBookmark): void {
		editing = bookmark;
		editorOpen = true;
	}

	function toggleFavorite(id: string): void {
		bookmarks = bookmarks.map((b) => (b.id === id ? { ...b, favorite: !b.favorite } : b));
	}

	function removeBookmark(id: string): void {
		bookmarks = bookmarks.filter((b) => b.id !== id);
	}

	function saveBookmark(next: PrototypeBookmark): void {
		const exists = bookmarks.some((b) => b.id === next.id);
		bookmarks = exists ? bookmarks.map((b) => (b.id === next.id ? next : b)) : [next, ...bookmarks];
	}

	function clearFilters(): void {
		q = '';
		favorite = false;
		tag = 'all';
	}
</script>

<Toolbar
	bind:q
	bind:favorite
	bind:tag
	bind:sort
	tags={ALL_TAGS}
	count={items.length}
	onnew={openCreate}
/>

{#if items.length === 0}
	<div
		class="flex flex-col items-center gap-3 rounded-xl border border-dashed border-border p-12 text-center"
	>
		<SearchX class="size-6 text-muted-foreground" />
		<p class="text-sm text-muted-foreground">No bookmarks match these filters.</p>
		<Button variant="outline" size="sm" onclick={clearFilters}>Clear filters</Button>
	</div>
{:else}
	{@const ActiveVariant = variant.component}
	<ActiveVariant
		{items}
		onToggleFavorite={toggleFavorite}
		onEdit={openEdit}
		onDelete={removeBookmark}
	/>
{/if}

<BookmarkEditorDialog
	bind:open={editorOpen}
	bookmark={editing}
	bind:media
	tags={ALL_TAGS}
	{usage}
	onsave={saveBookmark}
/>

<PrototypeSwitcher variants={VARIANTS.map(({ key, name }) => ({ key, name }))} />
