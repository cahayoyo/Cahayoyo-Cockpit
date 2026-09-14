<script lang="ts">
	// Folder placement variant 1 — sidebar tree (desktop-first, stacks above the grid on small screens).
	import FolderIcon from '@lucide/svelte/icons/folder';
	import Library from '@lucide/svelte/icons/library';
	import { cn } from '$lib/utils.js';
	import type { PrototypeFolder } from './data.js';

	let {
		folders,
		counts,
		folder = $bindable('all')
	}: {
		folders: PrototypeFolder[];
		counts: Record<string, number>;
		folder?: string;
	} = $props();

	const roots = $derived(folders.filter((f) => f.parentId === null));

	function children(id: string): PrototypeFolder[] {
		return folders.filter((f) => f.parentId === id);
	}
</script>

<nav class="w-full shrink-0 lg:w-56" aria-label="Folders">
	<ul class="space-y-0.5">
		<li>
			<button
				type="button"
				class={cn(
					'flex w-full items-center gap-2 rounded-md px-2.5 py-1.5 text-left text-sm transition-colors',
					folder === 'all'
						? 'bg-accent font-medium text-accent-foreground'
						: 'text-muted-foreground hover:bg-accent/50 hover:text-foreground'
				)}
				aria-current={folder === 'all' ? 'true' : undefined}
				onclick={() => (folder = 'all')}
			>
				<Library class="size-4 shrink-0" />
				All bookmarks
				<span class="ml-auto text-xs tabular-nums">{counts.all ?? 0}</span>
			</button>
		</li>

		{#each roots as root (root.id)}
			<li>
				<button
					type="button"
					class={cn(
						'flex w-full items-center gap-2 rounded-md px-2.5 py-1.5 text-left text-sm transition-colors',
						folder === root.id
							? 'bg-accent font-medium text-accent-foreground'
							: 'text-muted-foreground hover:bg-accent/50 hover:text-foreground'
					)}
					aria-current={folder === root.id ? 'true' : undefined}
					onclick={() => (folder = root.id)}
				>
					<FolderIcon class="size-4 shrink-0" />
					{root.name}
					<span class="ml-auto text-xs tabular-nums">{counts[root.id] ?? 0}</span>
				</button>
			</li>
			{#each children(root.id) as child (child.id)}
				<li class="pl-6">
					<button
						type="button"
						class={cn(
							'flex w-full items-center gap-2 rounded-md px-2.5 py-1.5 text-left text-sm transition-colors',
							folder === child.id
								? 'bg-accent font-medium text-accent-foreground'
								: 'text-muted-foreground hover:bg-accent/50 hover:text-foreground'
						)}
						aria-current={folder === child.id ? 'true' : undefined}
						onclick={() => (folder = child.id)}
					>
						{child.name}
						<span class="ml-auto text-xs tabular-nums">{counts[child.id] ?? 0}</span>
					</button>
				</li>
			{/each}
		{/each}
	</ul>
</nav>
