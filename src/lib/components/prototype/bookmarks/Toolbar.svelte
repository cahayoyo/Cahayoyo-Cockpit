<script lang="ts">
	import Plus from '@lucide/svelte/icons/plus';
	import Search from '@lucide/svelte/icons/search';
	import Star from '@lucide/svelte/icons/star';
	import { Button } from '$lib/components/ui/button/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import * as Select from '$lib/components/ui/select/index.js';
	import { cn } from '$lib/utils.js';

	let {
		q = $bindable(''),
		favorite = $bindable(false),
		tag = $bindable('all'),
		sort = $bindable('newest'),
		tags,
		count,
		onnew
	}: {
		q?: string;
		favorite?: boolean;
		tag?: string;
		sort?: string;
		tags: string[];
		count: number;
		onnew: () => void;
	} = $props();

	const tagLabel = $derived(tag === 'all' ? 'All tags' : tag);
	const sortLabel = $derived(sort === 'title' ? 'Title A–Z' : 'Newest first');
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

		<div class="hidden flex-1 sm:block"></div>

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
