<script lang="ts">
	// Shared card atoms (star + kebab) — variants keep their own layout.
	import EllipsisVertical from '@lucide/svelte/icons/ellipsis-vertical';
	import Pencil from '@lucide/svelte/icons/pencil';
	import Star from '@lucide/svelte/icons/star';
	import Trash2 from '@lucide/svelte/icons/trash-2';
	import { Button } from '$lib/components/ui/button/index.js';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
	import { cn } from '$lib/utils.js';
	import type { PrototypeBookmark } from './data.js';

	let {
		bookmark,
		overlay = false,
		onToggleFavorite,
		onEdit,
		onDelete
	}: {
		bookmark: PrototypeBookmark;
		overlay?: boolean;
		onToggleFavorite: (id: string) => void;
		onEdit: (bookmark: PrototypeBookmark) => void;
		onDelete: (id: string) => void;
	} = $props();

	const surface = $derived(overlay ? 'bg-background/90 shadow-sm' : '');
</script>

<div class={cn('relative z-10 flex items-center gap-1', overlay && 'rounded-full')}>
	<Button
		variant="ghost"
		size="icon-sm"
		class={surface}
		aria-label={bookmark.favorite ? 'Remove from favorites' : 'Add to favorites'}
		aria-pressed={bookmark.favorite}
		onclick={() => onToggleFavorite(bookmark.id)}
	>
		<Star class={cn('size-4', bookmark.favorite && 'fill-primary text-primary')} />
	</Button>

	<DropdownMenu.Root>
		<DropdownMenu.Trigger>
			{#snippet child({ props })}
				<Button
					variant="ghost"
					size="icon-sm"
					class={surface}
					aria-label="Bookmark actions"
					{...props}
				>
					<EllipsisVertical class="size-4" />
				</Button>
			{/snippet}
		</DropdownMenu.Trigger>
		<DropdownMenu.Content align="end">
			<DropdownMenu.Item onSelect={() => onEdit(bookmark)}>
				<Pencil class="size-4" />
				Edit
			</DropdownMenu.Item>
			<DropdownMenu.Item class="text-destructive" onSelect={() => onDelete(bookmark.id)}>
				<Trash2 class="size-4" />
				Delete
			</DropdownMenu.Item>
		</DropdownMenu.Content>
	</DropdownMenu.Root>
</div>
