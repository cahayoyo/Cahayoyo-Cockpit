<script lang="ts">
	// PROTOTYPE (branch `prototype/bookmarks`) — 3 view modes (grid / editorial / list)
	// behind `?view=`, plus one editor dialog and one media picker. Nothing here ships.
	import SearchX from '@lucide/svelte/icons/search-x';
	import type { Component } from 'svelte';
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import BookmarkEditorDialog from '$lib/components/prototype/bookmarks/BookmarkEditorDialog.svelte';
	import BookmarkEditorial from '$lib/components/prototype/bookmarks/BookmarkEditorial.svelte';
	import BookmarkGrid from '$lib/components/prototype/bookmarks/BookmarkGrid.svelte';
	import BookmarkList from '$lib/components/prototype/bookmarks/BookmarkList.svelte';
	import Toolbar from '$lib/components/prototype/bookmarks/Toolbar.svelte';
	import {
		ALL_TAGS,
		BOOKMARKS,
		MEDIA,
		filterBookmarks,
		withImages,
		type PrototypeBookmark,
		type PrototypeMedia,
		type SortKey,
		type ViewProps
	} from '$lib/components/prototype/bookmarks/data.js';
	import { Button } from '$lib/components/ui/button/index.js';

	const VIEWS: Record<string, Component<ViewProps>> = {
		grid: BookmarkGrid,
		editorial: BookmarkEditorial,
		list: BookmarkList
	};

	let bookmarks = $state<PrototypeBookmark[]>(structuredClone(BOOKMARKS));
	let media = $state<PrototypeMedia[]>(structuredClone(MEDIA));

	let q = $state('');
	let favorite = $state(false);
	let tag = $state('all');
	let sort = $state('newest');

	let editorOpen = $state(false);
	let editing = $state<PrototypeBookmark | null>(null);

	const view = $derived(page.url.searchParams.get('view') ?? 'grid');
	const activeView = $derived(VIEWS[view] ?? VIEWS.grid);

	const sortKey = $derived<SortKey>(sort === 'title' ? 'title' : 'newest');
	const items = $derived(withImages(filterBookmarks(bookmarks, q, favorite, tag, sortKey), media));
	const usage = $derived((id: string) => bookmarks.filter((b) => b.imageId === id).length);

	function setView(next: string): void {
		void goto(resolve(`/bookmarks?view=${next}`), {
			replaceState: true,
			noScroll: true,
			keepFocus: true
		});
	}

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
	{view}
	tags={ALL_TAGS}
	count={items.length}
	onnew={openCreate}
	onview={setView}
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
	{@const ActiveView = activeView}
	<ActiveView
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
