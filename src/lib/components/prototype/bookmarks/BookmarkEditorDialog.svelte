<script lang="ts">
	// One-off bookmark editor dialog for the prototype (create + edit).
	import ImageIcon from '@lucide/svelte/icons/image';
	import Star from '@lucide/svelte/icons/star';
	import { Button } from '$lib/components/ui/button/index.js';
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Label } from '$lib/components/ui/label/index.js';
	import { Textarea } from '$lib/components/ui/textarea/index.js';
	import { cn } from '$lib/utils.js';
	import FolderPicker from './FolderPicker.svelte';
	import MediaPickerDialog from './MediaPickerDialog.svelte';
	import type { PrototypeBookmark, PrototypeFolder, PrototypeMedia } from './data.js';

	let {
		open = $bindable(false),
		bookmark = null,
		media = $bindable<PrototypeMedia[]>([]),
		folders,
		tags,
		usage,
		onsave
	}: {
		open?: boolean;
		bookmark?: PrototypeBookmark | null;
		media?: PrototypeMedia[];
		folders: PrototypeFolder[];
		tags: string[];
		usage: (id: string) => number;
		onsave: (bookmark: PrototypeBookmark) => void;
	} = $props();

	type Draft = {
		title: string;
		url: string;
		description: string;
		tagsText: string;
		folderId: string;
		favorite: boolean;
	};

	let draft = $state<Draft>({
		title: '',
		url: '',
		description: '',
		tagsText: '',
		folderId: 'none',
		favorite: false
	});
	let imageId = $state<string | null>(null);
	let pickerOpen = $state(false);

	$effect(() => {
		if (!open) return;
		draft = bookmark
			? {
					title: bookmark.title,
					url: bookmark.url,
					description: bookmark.description,
					tagsText: bookmark.tags.join(', '),
					folderId: bookmark.folderId ?? 'none',
					favorite: bookmark.favorite
				}
			: { title: '', url: '', description: '', tagsText: '', folderId: 'none', favorite: false };
		imageId = bookmark?.imageId ?? null;
	});

	const selected = $derived(media.find((m) => m.id === imageId) ?? null);
	const urlInvalid = $derived(
		draft.url.trim().length > 0 && !/^https?:\/\//.test(draft.url.trim())
	);
	const canSave = $derived(
		draft.title.trim().length > 0 && !urlInvalid && draft.url.trim().length > 0
	);

	function submit(event: SubmitEvent): void {
		event.preventDefault();
		if (!canSave) return;
		const parsedTags = [
			...new Set(
				draft.tagsText
					.split(',')
					.map((t) => t.trim().toLowerCase())
					.filter(Boolean)
			)
		];
		onsave({
			id: bookmark?.id ?? crypto.randomUUID(),
			title: draft.title.trim(),
			url: draft.url.trim(),
			description: draft.description.trim(),
			favorite: draft.favorite,
			createdAt: bookmark?.createdAt ?? new Date().toISOString(),
			imageId,
			folderId: draft.folderId === 'none' ? null : draft.folderId,
			tags: parsedTags
		});
		open = false;
	}
</script>

<Dialog.Root bind:open>
	<Dialog.Content class="sm:max-w-lg">
		<Dialog.Header>
			<Dialog.Title>{bookmark ? 'Edit bookmark' : 'New bookmark'}</Dialog.Title>
			<Dialog.Description>
				{bookmark ? 'Update the link details.' : 'Save a link with an optional preview image.'}
			</Dialog.Description>
		</Dialog.Header>

		<form class="space-y-4" onsubmit={submit}>
			<div class="space-y-2">
				<Label for="bm-title">Title</Label>
				<Input id="bm-title" bind:value={draft.title} placeholder="SvelteKit documentation" />
			</div>

			<div class="space-y-2">
				<Label for="bm-url">URL</Label>
				<Input
					id="bm-url"
					bind:value={draft.url}
					placeholder="https://example.com/page"
					aria-invalid={urlInvalid}
				/>
				{#if urlInvalid}
					<p class="text-sm text-destructive">Only http:// and https:// links are allowed.</p>
				{/if}
			</div>

			<div class="space-y-2">
				<Label for="bm-description">Description</Label>
				<Textarea
					id="bm-description"
					bind:value={draft.description}
					placeholder="Optional note about this link"
				/>
			</div>

			<div class="space-y-2">
				<Label for="bm-tags">Tags</Label>
				<Input
					id="bm-tags"
					bind:value={draft.tagsText}
					list="bookmark-tags"
					placeholder="qa, docs"
				/>
				<datalist id="bookmark-tags">
					{#each tags as t (t)}
						<option value={t}></option>
					{/each}
				</datalist>
				<p class="text-xs text-muted-foreground">Comma-separated; type to reuse an existing tag.</p>
			</div>

			<div class="space-y-2">
				<span class="text-sm font-medium">Folder</span>
				<FolderPicker
					bind:value={draft.folderId}
					{folders}
					empty={{ value: 'none', label: 'No folder' }}
					label="Folder"
					class="w-full"
				/>
			</div>

			<div class="flex flex-wrap items-center gap-2">
				<Button
					type="button"
					variant={draft.favorite ? 'secondary' : 'outline'}
					aria-pressed={draft.favorite}
					onclick={() => (draft.favorite = !draft.favorite)}
				>
					<Star class={cn(draft.favorite && 'fill-primary text-primary')} />
					Favorite
				</Button>
			</div>

			<div class="space-y-2">
				<span class="text-sm font-medium">Image</span>
				<div class="flex items-center gap-3">
					<div class="grid size-16 shrink-0 place-items-center overflow-hidden rounded-lg bg-muted">
						{#if selected}
							<img src={selected.url} alt="" class="size-full object-cover" />
						{:else}
							<ImageIcon class="size-5 text-muted-foreground" />
						{/if}
					</div>
					<div class="flex items-center gap-1">
						<Button type="button" variant="outline" size="sm" onclick={() => (pickerOpen = true)}>
							{selected ? 'Change image' : 'Choose image'}
						</Button>
						{#if selected}
							<Button type="button" variant="ghost" size="sm" onclick={() => (imageId = null)}>
								Remove
							</Button>
						{/if}
					</div>
				</div>
				<p class="text-xs text-muted-foreground">
					{selected ? selected.name : 'Optional — cards fall back to the title initial.'}
				</p>
			</div>

			<Dialog.Footer>
				<Button type="button" variant="secondary" onclick={() => (open = false)}>Cancel</Button>
				<Button type="submit" disabled={!canSave}>
					{bookmark ? 'Save changes' : 'Add bookmark'}
				</Button>
			</Dialog.Footer>
		</form>

		<MediaPickerDialog
			bind:open={pickerOpen}
			bind:media
			selectedId={imageId}
			{usage}
			onpick={(id) => (imageId = id)}
		/>
	</Dialog.Content>
</Dialog.Root>
