import Bookmark from '@lucide/svelte/icons/bookmark';
import House from '@lucide/svelte/icons/house';
import Lock from '@lucide/svelte/icons/lock';
import Mail from '@lucide/svelte/icons/mail';
import NotebookPen from '@lucide/svelte/icons/notebook-pen';
import SquareCheckBig from '@lucide/svelte/icons/square-check-big';
import Wrench from '@lucide/svelte/icons/wrench';

export const NAV_ITEMS = [
	{ href: '/', label: 'Cockpit', icon: House },
	{ href: '/bookmarks', label: 'Bookmarks', icon: Bookmark },
	{ href: '/notes', label: 'Notes', icon: NotebookPen },
	{ href: '/tasks', label: 'Tasks', icon: SquareCheckBig },
	{ href: '/toolkit', label: 'Toolkit', icon: Wrench },
	{ href: '/emails', label: 'Emails', icon: Mail },
	{ href: '/vault', label: 'Vault', icon: Lock }
] as const;

export function isActivePath(path: string, href: string): boolean {
	return path === href || (href !== '/' && path.startsWith(`${href}/`));
}

export function currentLabel(path: string): string {
	return NAV_ITEMS.find((item) => isActivePath(path, item.href))?.label ?? NAV_ITEMS[0].label;
}
