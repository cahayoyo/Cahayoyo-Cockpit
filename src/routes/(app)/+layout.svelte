<script lang="ts">
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import Bookmark from '@lucide/svelte/icons/bookmark';
	import ChevronDown from '@lucide/svelte/icons/chevron-down';
	import House from '@lucide/svelte/icons/house';
	import Lock from '@lucide/svelte/icons/lock';
	import LogOut from '@lucide/svelte/icons/log-out';
	import Mail from '@lucide/svelte/icons/mail';
	import Menu from '@lucide/svelte/icons/menu';
	import Moon from '@lucide/svelte/icons/moon';
	import NotebookPen from '@lucide/svelte/icons/notebook-pen';
	import SquareCheckBig from '@lucide/svelte/icons/square-check-big';
	import Sun from '@lucide/svelte/icons/sun';
	import Wrench from '@lucide/svelte/icons/wrench';
	import { toggleMode } from 'mode-watcher';
	import { Button } from '$lib/components/ui/button/index.js';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
	import * as Sheet from '$lib/components/ui/sheet/index.js';
	import { cn } from '$lib/utils.js';
	import type { LayoutProps } from './$types.js';

	let { data, children }: LayoutProps = $props();

	const navItems = [
		{ href: '/', label: 'Home', icon: House },
		{ href: '/bookmarks', label: 'Bookmarks', icon: Bookmark },
		{ href: '/notes', label: 'Notes', icon: NotebookPen },
		{ href: '/tasks', label: 'Tasks', icon: SquareCheckBig },
		{ href: '/toolkit', label: 'Toolkit', icon: Wrench },
		{ href: '/emails', label: 'Emails', icon: Mail },
		{ href: '/vault', label: 'Vault', icon: Lock }
	] as const;

	let navOpen = $state(false);
	let signOutForm: HTMLFormElement | null = $state(null);

	const current = $derived(navItems.find((item) => isActive(item.href)) ?? navItems[0]);

	function isActive(href: string): boolean {
		const path = page.url.pathname;
		return path === href || (href !== '/' && path.startsWith(`${href}/`));
	}
</script>

{#snippet navLinks()}
	{#each navItems as item (item.href)}
		{@const active = isActive(item.href)}
		<a
			href={resolve(item.href)}
			aria-current={active ? 'page' : undefined}
			class={cn(
				'flex min-h-11 w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors motion-reduce:transition-none',
				active
					? 'bg-sidebar-accent text-sidebar-accent-foreground'
					: 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
			)}
			onclick={() => (navOpen = false)}
		>
			<item.icon class="size-4" />
			{item.label}
		</a>
	{/each}
{/snippet}

{#snippet accountMenu()}
	<DropdownMenu.Root>
		<DropdownMenu.Trigger>
			{#snippet child({ props })}
				<Button variant="ghost" size="sm" class="min-h-11 gap-2 sm:min-h-7" {...props}>
					<span
						class="grid size-6 shrink-0 place-items-center rounded-full bg-muted text-xs font-medium"
					>
						{data.user?.email.slice(0, 1).toUpperCase()}
					</span>
					<span class="hidden max-w-40 truncate sm:inline">{data.user?.email}</span>
					<ChevronDown class="size-4 text-muted-foreground" />
				</Button>
			{/snippet}
		</DropdownMenu.Trigger>
		<DropdownMenu.Content align="end">
			<DropdownMenu.Label class="truncate">{data.user?.email}</DropdownMenu.Label>
			<DropdownMenu.Separator />
			<DropdownMenu.Item onSelect={() => signOutForm?.requestSubmit()}>
				<LogOut />
				Log out
			</DropdownMenu.Item>
		</DropdownMenu.Content>
	</DropdownMenu.Root>
{/snippet}

<form method="POST" action="/logout" bind:this={signOutForm} class="hidden"></form>

<div class="flex min-h-svh flex-col bg-background">
	<header class="flex h-14 items-center gap-2 border-b border-border px-4">
		<Button
			variant="ghost"
			size="icon-sm"
			class="size-11 sm:size-7"
			aria-label="Open navigation"
			onclick={() => (navOpen = true)}
		>
			<Menu />
		</Button>
		<div class="grid size-8 shrink-0 place-items-center rounded-md bg-primary">
			<img src="/logo/cahayoyo-mark.png" alt="" class="size-5 brightness-0 invert" />
		</div>
		<span class="hidden text-sm font-semibold sm:inline">Cahayoyo Cockpit</span>
		<h1 class="min-w-0 flex-1 truncate text-lg font-semibold">{current.label}</h1>
		<Button
			variant="ghost"
			size="icon-sm"
			class="size-11 sm:size-7"
			aria-label="Toggle theme"
			onclick={toggleMode}
		>
			<Moon class="dark:hidden" />
			<Sun class="hidden dark:block" />
		</Button>
		{@render accountMenu()}
	</header>

	<main class="flex-1 overflow-y-auto">
		<div class="mx-auto w-full max-w-7xl space-y-6 px-4 py-6 sm:px-6 lg:px-8">
			{@render children()}
		</div>
	</main>
</div>

<Sheet.Root bind:open={navOpen}>
	<Sheet.Content side="left" class="w-72 bg-sidebar text-sidebar-foreground">
		<Sheet.Header class="gap-3">
			<img
				src="/logo/cahayoyo-logo-transparant.png"
				alt="Cahayoyo"
				class="h-12 w-auto dark:hidden"
			/>
			<img
				src="/logo/cahayoyo-logo-inverse.png"
				alt="Cahayoyo"
				class="hidden h-12 w-auto dark:block"
			/>
			<Sheet.Title class="sr-only">Navigation</Sheet.Title>
		</Sheet.Header>
		<nav class="flex-1 space-y-1 px-2" aria-label="Main">
			{@render navLinks()}
		</nav>
	</Sheet.Content>
</Sheet.Root>
