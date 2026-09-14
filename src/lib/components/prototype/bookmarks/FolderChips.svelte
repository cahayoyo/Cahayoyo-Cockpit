<script lang="ts">
	// Folder placement variant 3 — chip rows per level (breadcrumb-style drill-down).
	import { Button } from '$lib/components/ui/button/index.js';
	import { folderPath, type PrototypeFolder } from './data.js';

	let {
		folders,
		counts,
		folder = $bindable('all')
	}: {
		folders: PrototypeFolder[];
		counts: Record<string, number>;
		folder?: string;
	} = $props();

	const path = $derived(folder === 'all' ? [] : folderPath(folders, folder));

	const levels = $derived.by(() => {
		const rows: PrototypeFolder[][] = [folders.filter((f) => f.parentId === null)];
		for (const f of path) {
			const kids = folders.filter((x) => x.parentId === f.id);
			if (kids.length === 0) break;
			rows.push(kids);
		}
		return rows;
	});

	function countLabel(id: string): string {
		return `${counts[id] ?? 0}`;
	}
</script>

<div class="space-y-2">
	{#each levels as level, depth (depth)}
		<div class="flex flex-wrap items-center gap-1.5">
			{#if depth === 0}
				<Button
					variant={folder === 'all' ? 'secondary' : 'outline'}
					size="sm"
					aria-pressed={folder === 'all'}
					onclick={() => (folder = 'all')}
				>
					All bookmarks
					<span class="text-xs text-muted-foreground tabular-nums">{counts.all ?? 0}</span>
				</Button>
			{:else}
				{@const parent = path[depth - 1]}
				<Button variant="ghost" size="sm" onclick={() => (folder = parent.id)}>
					All in {parent.name}
				</Button>
			{/if}

			{#each level as f (f.id)}
				<Button
					variant={folder === f.id ? 'secondary' : 'outline'}
					size="sm"
					aria-pressed={folder === f.id}
					onclick={() => (folder = f.id)}
				>
					{f.name}
					<span class="text-xs text-muted-foreground tabular-nums">{countLabel(f.id)}</span>
				</Button>
			{/each}
		</div>
	{/each}
</div>
