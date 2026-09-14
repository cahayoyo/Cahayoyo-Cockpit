<script lang="ts">
	// One-off Media Library picker for the prototype: dropzone + existing-image grid.
	import Check from '@lucide/svelte/icons/check';
	import Trash2 from '@lucide/svelte/icons/trash-2';
	import Upload from '@lucide/svelte/icons/upload';
	import { Button } from '$lib/components/ui/button/index.js';
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import { formatBytes, type PrototypeMedia } from './data.js';

	let {
		open = $bindable(false),
		media = $bindable<PrototypeMedia[]>([]),
		selectedId = null,
		usage,
		onpick
	}: {
		open?: boolean;
		media?: PrototypeMedia[];
		selectedId?: string | null;
		usage: (id: string) => number;
		onpick: (id: string) => void;
	} = $props();

	const ALLOWED = ['image/jpeg', 'image/png', 'image/webp'];
	const MAX_BYTES = 5 * 1024 * 1024;

	let error = $state('');

	function addFile(files: FileList | null): void {
		error = '';
		const file = files?.[0];
		if (!file) return;
		if (!ALLOWED.includes(file.type)) {
			error = 'Only JPEG, PNG, or WebP images are allowed.';
			return;
		}
		if (file.size > MAX_BYTES) {
			error = 'Image must be 5 MB or smaller.';
			return;
		}
		media = [
			{
				id: crypto.randomUUID(),
				name: file.name,
				url: URL.createObjectURL(file),
				sizeBytes: file.size
			},
			...media
		];
	}

	function removeItem(id: string): void {
		const item = media.find((m) => m.id === id);
		if (item?.url.startsWith('blob:')) URL.revokeObjectURL(item.url);
		media = media.filter((m) => m.id !== id);
	}

	function pick(id: string): void {
		onpick(id);
		open = false;
	}
</script>

<Dialog.Root bind:open>
	<Dialog.Content class="sm:max-w-2xl">
		<Dialog.Header>
			<Dialog.Title>Image library</Dialog.Title>
			<Dialog.Description>Upload once, reuse the same image across bookmarks.</Dialog.Description>
		</Dialog.Header>

		<label
			class="flex cursor-pointer flex-col items-center gap-1.5 rounded-xl border border-dashed border-input p-6 text-center transition-colors hover:bg-accent"
			ondragover={(e) => e.preventDefault()}
			ondrop={(e) => {
				e.preventDefault();
				addFile(e.dataTransfer?.files ?? null);
			}}
		>
			<Upload class="size-5 text-muted-foreground" />
			<span class="text-sm font-medium">Click to upload or drop an image</span>
			<span class="text-xs text-muted-foreground">JPEG, PNG, or WebP — up to 5 MB</span>
			<input
				type="file"
				class="sr-only"
				accept="image/jpeg,image/png,image/webp"
				onchange={(e) => addFile(e.currentTarget.files)}
			/>
		</label>

		{#if error}
			<p class="text-sm text-destructive">{error}</p>
		{/if}

		<div class="grid max-h-80 grid-cols-2 gap-3 overflow-y-auto sm:grid-cols-3">
			{#each media as m (m.id)}
				{@const used = usage(m.id)}
				<div class="overflow-hidden rounded-lg ring-1 ring-foreground/10">
					<button
						type="button"
						class="relative block w-full cursor-pointer"
						aria-label="Use {m.name}"
						onclick={() => pick(m.id)}
					>
						<img src={m.url} alt="" class="aspect-square w-full object-cover" />
						{#if m.id === selectedId}
							<span
								class="absolute top-1.5 left-1.5 grid size-5 place-items-center rounded-full bg-primary text-primary-foreground"
							>
								<Check class="size-3" />
							</span>
						{/if}
					</button>
					<div class="flex items-center gap-1 p-1.5">
						<div class="min-w-0 flex-1">
							<p class="truncate text-xs">{m.name}</p>
							<p class="text-xs text-muted-foreground">
								{formatBytes(m.sizeBytes)} ·
								{used > 0 ? ` used by ${used} ${used === 1 ? 'bookmark' : 'bookmarks'}` : ' unused'}
							</p>
						</div>
						<Button
							variant="ghost"
							size="icon-xs"
							class="text-destructive"
							disabled={used > 0}
							aria-label="Delete {m.name}"
							title={used > 0 ? 'Cannot delete while bookmarks use this image' : 'Delete image'}
							onclick={() => removeItem(m.id)}
						>
							<Trash2 class="size-3.5" />
						</Button>
					</div>
				</div>
			{/each}
		</div>

		<Dialog.Footer>
			<Button variant="secondary" onclick={() => (open = false)}>Close</Button>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>
