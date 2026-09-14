<script lang="ts">
	import Columns2 from '@lucide/svelte/icons/columns-2';
	import LayoutGrid from '@lucide/svelte/icons/layout-grid';
	import List from '@lucide/svelte/icons/list';
	import Plus from '@lucide/svelte/icons/plus';
	import RotateCcw from '@lucide/svelte/icons/rotate-ccw';
	import Search from '@lucide/svelte/icons/search';
	import Star from '@lucide/svelte/icons/star';
	import { Button } from '$lib/components/ui/button/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import * as Select from '$lib/components/ui/select/index.js';
	import { cn } from '$lib/utils.js';

	const VIEWS = [
		{ key: 'grid', label: 'Grid view', icon: LayoutGrid },
		{ key: 'editorial', label: 'Editorial view', icon: Columns2 },
		{ key: 'list', label: 'List view', icon: List }
	] as const;

	let {
		q = $bindable(''),
		favorite = $bindable(false),
		tag = $bindable('all'),
		sort = $bindable('newest'),
		view = 'grid',
		tags,
		count,
		onnew,
		onview,
		onreset
	}: {
		q?: string;
		favorite?: boolean;
		tag?: string;
		sort?: string;
		view?: string;
		tags: string[];
		count: number;
		onnew: () => void;
		onview: (view: string) => void;
		onreset: () => void;
	} = $props();

	const tagLabel = $derived(tag === 'all' ? 'All tags' : tag);
	const sortLabel = $derived(sort === 'title' ? 'Title A–Z' : 'Newest first');
	const filtersActive = $derived(
		q.trim().length > 0 || favorite || tag !== 'all' || sort !== 'newest'
	);
</script>

<div class="flex flex-col gap-3">
	<div class="flex flex-wrap items-center gap-2">
		<div class="relative w-full sm:w-64">
			<Search
				class="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground"
			/>
			<Input
				bind:value={q}
				placeholder="Search title or URL"
				class="pl-8"
				aria-label="Search bookmarks"
			/>
		</div>

		<Button
			variant={favorite ? 'secondary' : 'outline'}
			aria-pressed={favorite}
			onclick={() => (favorite = !favorite)}
		>
			<Star class={cn(favorite && 'fill-primary text-primary')} />
			Favorites
		</Button>

		<Select.Root type="single" bind:value={tag}>
			<Select.Trigger class="min-w-32" aria-label="Filter by tag">{tagLabel}</Select.Trigger>
			<Select.Content>
				<Select.Item value="all" label="All tags">All tags</Select.Item>
				{#each tags as t (t)}
					<Select.Item value={t} label={t}>{t}</Select.Item>
				{/each}
			</Select.Content>
		</Select.Root>

		<Select.Root type="single" bind:value={sort}>
			<Select.Trigger class="min-w-36" aria-label="Sort bookmarks">{sortLabel}</Select.Trigger>
			<Select.Content>
				<Select.Item value="newest" label="Newest first">Newest first</Select.Item>
				<Select.Item value="title" label="Title A–Z">Title A–Z</Select.Item>
			</Select.Content>
		</Select.Root>

		<Button
			variant="ghost"
			size="icon-sm"
			disabled={!filtersActive}
			aria-label="Reset filters"
			title="Reset filters"
			onclick={onreset}
		>
			<RotateCcw class="size-4" />
		</Button>

		<div class="hidden flex-1 sm:block"></div>

		<div
			class="flex items-center gap-0.5 rounded-lg border border-border p-0.5"
			role="group"
			aria-label="View"
		>
			{#each VIEWS as v (v.key)}
				<Button
					variant={view === v.key ? 'secondary' : 'ghost'}
					size="icon-sm"
					aria-label={v.label}
					title={v.label}
					aria-pressed={view === v.key}
					onclick={() => onview(v.key)}
				>
					<v.icon class="size-4" />
				</Button>
			{/each}
		</div>

		<Button onclick={onnew}>
			<Plus />
			New bookmark
		</Button>
	</div>

	<p class="text-xs text-muted-foreground tabular-nums">
		{count}
		{count === 1 ? 'bookmark' : 'bookmarks'}
	</p>
</div>
