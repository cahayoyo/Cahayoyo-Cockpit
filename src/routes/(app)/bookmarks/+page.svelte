<script lang="ts">
	// PROTOTYPE (branch `prototype/bookmarks`) — 3 card views (`?view=`) x 3 folder
	// placements (`?folders=`), plus one editor dialog and one media picker. Nothing ships.
	import SearchX from '@lucide/svelte/icons/search-x';
	import type { Component } from 'svelte';
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import PrototypeSwitcher from '$lib/components/prototype/PrototypeSwitcher.svelte';
	import BookmarkEditorDialog from '$lib/components/prototype/bookmarks/BookmarkEditorDialog.svelte';
	import BookmarkEditorial from '$lib/components/prototype/bookmarks/BookmarkEditorial.svelte';
	import BookmarkGrid from '$lib/components/prototype/bookmarks/BookmarkGrid.svelte';
	import BookmarkList from '$lib/components/prototype/bookmarks/BookmarkList.svelte';
	import FolderChips from '$lib/components/prototype/bookmarks/FolderChips.svelte';
	import FolderPicker from '$lib/components/prototype/bookmarks/FolderPicker.svelte';
	import FolderSidebar from '$lib/components/prototype/bookmarks/FolderSidebar.svelte';
	import Toolbar from '$lib/components/prototype/bookmarks/Toolbar.svelte';
	import {
		ALL_TAGS,
		BOOKMARKS,
		FOLDERS,
		MEDIA,
		filterBookmarks,
		folderCounts,
		folderIdsWithDescendants,
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

	const FOLDER_LAYOUTS = [
		{ key: 'sidebar', name: 'Folders: sidebar tree' },
		{ key: 'toolbar', name: 'Folders: toolbar dropdown' },
		{ key: 'chips', name: 'Folders: chip rows' }
	];

	let bookmarks = $state<PrototypeBookmark[]>(structuredClone(BOOKMARKS));
	let media = $state<PrototypeMedia[]>(structuredClone(MEDIA));

	let q = $state('');
	let favorite = $state(false);
	let tag = $state('all');
	let sort = $state('newest');
	let folder = $state('all');

	let editorOpen = $state(false);
	let editing = $state<PrototypeBookmark | null>(null);

	const view = $derived(page.url.searchParams.get('view') ?? 'grid');
	const activeView = $derived(VIEWS[view] ?? VIEWS.grid);
	const folderMode = $derived(page.url.searchParams.get('folders') ?? 'sidebar');

	const sortKey = $derived<SortKey>(sort === 'title' ? 'title' : 'newest');
	const folderIds = $derived(folder === 'all' ? null : folderIdsWithDescendants(FOLDERS, folder));
	const items = $derived(
		withImages(filterBookmarks(bookmarks, q, favorite, tag, sortKey, folderIds), media)
	);
	const counts = $derived(folderCounts(bookmarks, FOLDERS));
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
		sort = 'newest';
		folder = 'all';
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
	onreset={clearFilters}
>
	{#snippet folderFilter()}
		{#if folderMode === 'toolbar'}
			<FolderPicker
				bind:value={folder}
				folders={FOLDERS}
				empty={{ value: 'all', label: 'All folders' }}
				label="Filter by folder"
				class="min-w-36"
			/>
		{/if}
	{/snippet}
</Toolbar>

<div class="flex flex-col gap-6 lg:flex-row lg:items-start">
	{#if folderMode === 'sidebar'}
		<FolderSidebar folders={FOLDERS} {counts} bind:folder />
	{/if}

	<div class="min-w-0 flex-1 space-y-4">
		{#if folderMode === 'chips'}
			<FolderChips folders={FOLDERS} {counts} bind:folder />
		{/if}

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
	</div>
</div>

<BookmarkEditorDialog
	bind:open={editorOpen}
	bookmark={editing}
	bind:media
	folders={FOLDERS}
	tags={ALL_TAGS}
	{usage}
	onsave={saveBookmark}
/>

<PrototypeSwitcher param="folders" variants={FOLDER_LAYOUTS} />
