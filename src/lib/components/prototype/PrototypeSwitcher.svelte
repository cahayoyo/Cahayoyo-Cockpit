<script lang="ts">
	// Dev-only floating switcher for UI prototypes. Rebuilt per prototype branch.
	import ArrowLeft from '@lucide/svelte/icons/arrow-left';
	import ArrowRight from '@lucide/svelte/icons/arrow-right';
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { page } from '$app/state';

	let { param, variants }: { param: string; variants: { key: string; name: string }[] } = $props();

	const dev = import.meta.env.DEV;

	const current = $derived(page.url.searchParams.get(param) ?? variants[0].key);
	const index = $derived(
		Math.max(
			0,
			variants.findIndex((v) => v.key === current)
		)
	);
	const active = $derived(variants[index]);

	function cycle(step: number): void {
		const next = variants[(index + step + variants.length) % variants.length].key;
		const url = new URL(page.url);
		url.searchParams.set(param, next);
		void goto(resolve(`/bookmarks?${url.searchParams.toString()}`), {
			replaceState: true,
			noScroll: true,
			keepFocus: true
		});
	}

	function onKeydown(event: KeyboardEvent): void {
		if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
		const target = event.target as HTMLElement | null;
		if (
			target &&
			(target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable)
		)
			return;
		event.preventDefault();
		cycle(event.key === 'ArrowLeft' ? -1 : 1);
	}
</script>

<svelte:window onkeydown={onKeydown} />

{#if dev}
	<div
		class="fixed bottom-4 left-1/2 z-50 flex -translate-x-1/2 items-center gap-1 rounded-full bg-foreground px-1.5 py-1 text-background shadow-lg"
	>
		<button
			type="button"
			class="grid size-7 cursor-pointer place-items-center rounded-full transition-colors hover:bg-background/20"
			aria-label="Previous layout"
			onclick={() => cycle(-1)}
		>
			<ArrowLeft class="size-4" />
		</button>
		<span class="min-w-44 text-center text-xs font-medium tabular-nums">
			{active.name} ({index + 1}/{variants.length})
		</span>
		<button
			type="button"
			class="grid size-7 cursor-pointer place-items-center rounded-full transition-colors hover:bg-background/20"
			aria-label="Next layout"
			onclick={() => cycle(1)}
		>
			<ArrowRight class="size-4" />
		</button>
	</div>
{/if}
