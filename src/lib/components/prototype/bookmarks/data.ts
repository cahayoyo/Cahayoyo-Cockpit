// Throwaway prototype data for the Bookmarks card-grid variants (Phase 5).
// No DB, no server — in-memory arrays only. Delete with the prototype branch.

export type PrototypeMedia = {
	id: string;
	name: string;
	url: string;
	sizeBytes: number;
};

export type PrototypeBookmark = {
	id: string;
	title: string;
	url: string;
	description: string;
	favorite: boolean;
	createdAt: string;
	imageId: string | null;
	folderId: string | null;
	tags: string[];
};

export type PrototypeFolder = {
	id: string;
	name: string;
	parentId: string | null;
};

export const FOLDERS: PrototypeFolder[] = [
	{ id: 'f1', name: 'qa', parentId: null },
	{ id: 'f2', name: 'automation', parentId: 'f1' },
	{ id: 'f3', name: 'manual', parentId: 'f1' },
	{ id: 'f4', name: 'devops', parentId: null },
	{ id: 'f5', name: 'infra', parentId: 'f4' },
	{ id: 'f6', name: 'ci', parentId: 'f4' },
	{ id: 'f7', name: 'docs', parentId: null }
];

export type BookmarkView = PrototypeBookmark & { image: PrototypeMedia | null };

export type ViewProps = {
	items: BookmarkView[];
	onToggleFavorite: (id: string) => void;
	onEdit: (bookmark: PrototypeBookmark) => void;
	onDelete: (id: string) => void;
};

export const MEDIA: PrototypeMedia[] = [
	{
		id: 'm1',
		name: 'sveltekit-routing.png',
		url: '/prototype/bookmarks/img-01.svg',
		sizeBytes: 412_000
	},
	{
		id: 'm2',
		name: 'drizzle-column-types.png',
		url: '/prototype/bookmarks/img-02.svg',
		sizeBytes: 356_000
	},
	{
		id: 'm3',
		name: 'playwright-best-practices.png',
		url: '/prototype/bookmarks/img-03.svg',
		sizeBytes: 298_000
	},
	{
		id: 'm4',
		name: 'tailwind-theme-vars.png',
		url: '/prototype/bookmarks/img-04.svg',
		sizeBytes: 244_000
	},
	{
		id: 'm5',
		name: 'shadcn-select.png',
		url: '/prototype/bookmarks/img-05.svg',
		sizeBytes: 331_000
	},
	{
		id: 'm6',
		name: 'og-image-archive.png',
		url: '/prototype/bookmarks/img-06.svg',
		sizeBytes: 187_000
	}
];

export const BOOKMARKS: PrototypeBookmark[] = [
	{
		id: 'b1',
		title: 'SvelteKit documentation — Routing',
		url: 'https://svelte.dev/docs/kit/routing',
		description: 'Filesystem-based routing, layouts, and page options.',
		favorite: true,
		createdAt: '2026-09-12T09:20:00Z',
		imageId: 'm1',
		folderId: 'f7',
		tags: ['svelte', 'docs']
	},
	{
		id: 'b2',
		title: 'Drizzle ORM — PostgreSQL column types',
		url: 'https://orm.drizzle.team/docs/column-types/pg',
		description: 'Schema definition reference for pg-core columns.',
		favorite: true,
		createdAt: '2026-09-10T14:05:00Z',
		imageId: 'm2',
		folderId: 'f4',
		tags: ['db', 'docs']
	},
	{
		id: 'b3',
		title: 'Playwright — Best practices',
		url: 'https://playwright.dev/docs/best-practices',
		description: 'Locators, test isolation, and web-first assertions.',
		favorite: false,
		createdAt: '2026-09-08T07:40:00Z',
		imageId: 'm3',
		folderId: 'f2',
		tags: ['qa', 'testing']
	},
	{
		id: 'b4',
		title: 'Tailwind CSS — Theme variables',
		url: 'https://tailwindcss.com/docs/theme',
		description: 'Design tokens as CSS variables in v4.',
		favorite: false,
		createdAt: '2026-09-05T16:30:00Z',
		imageId: 'm4',
		folderId: 'f7',
		tags: ['css', 'docs']
	},
	{
		id: 'b5',
		title: 'shadcn-svelte — Components',
		url: 'https://shadcn-svelte.com/docs/components/select',
		description: 'Copy-paste components built on Bits UI.',
		favorite: false,
		createdAt: '2026-09-03T11:15:00Z',
		imageId: 'm5',
		folderId: 'f7',
		tags: ['ui', 'svelte']
	},
	{
		id: 'b6',
		title: 'PostgreSQL 17 release notes',
		url: 'https://www.postgresql.org/docs/17/release-17.html',
		description: 'What changed in the current major version.',
		favorite: false,
		createdAt: '2026-08-28T10:00:00Z',
		imageId: null,
		folderId: 'f4',
		tags: ['db']
	},
	{
		id: 'b7',
		title: 'OWASP Web Security Testing Guide',
		url: 'https://owasp.org/www-project-web-security-testing-guide/',
		description: 'The checklist for security-adjacent QA work.',
		favorite: false,
		createdAt: '2026-08-21T08:45:00Z',
		imageId: null,
		folderId: 'f3',
		tags: ['security', 'qa']
	},
	{
		id: 'b8',
		title: 'Drizzle Studio',
		url: 'https://orm.drizzle.team/drizzle-studio/overview',
		description: 'Local data browser for the Drizzle schema.',
		favorite: false,
		createdAt: '2026-08-15T13:25:00Z',
		imageId: 'm2',
		folderId: 'f4',
		tags: ['db']
	},
	{
		id: 'b9',
		title: 'Playwright — Locators',
		url: 'https://playwright.dev/docs/locators',
		description: 'getByRole, getByLabel, and chaining locators.',
		favorite: false,
		createdAt: '2026-08-12T09:00:00Z',
		imageId: null,
		folderId: 'f2',
		tags: ['qa', 'testing']
	},
	{
		id: 'b10',
		title: 'GitHub Actions — Workflow syntax',
		url: 'https://docs.github.com/en/actions/reference/workflows-and-actions/workflow-syntax',
		description: 'Jobs, steps, triggers, and expressions reference.',
		favorite: false,
		createdAt: '2026-08-08T15:30:00Z',
		imageId: null,
		folderId: 'f6',
		tags: ['devops', 'ci']
	},
	{
		id: 'b11',
		title: 'Docker Docs — Compose file reference',
		url: 'https://docs.docker.com/reference/compose-file/',
		description: 'Service, network, and volume definitions.',
		favorite: false,
		createdAt: '2026-08-04T11:10:00Z',
		imageId: null,
		folderId: 'f5',
		tags: ['devops', 'infra']
	},
	{
		id: 'b12',
		title: 'TestRail — Test case design best practices',
		url: 'https://www.gurock.com/testrail/test-management/test-case-best-practices',
		description: 'Coverage, traceability, and reusable steps.',
		favorite: false,
		createdAt: '2026-07-29T08:20:00Z',
		imageId: null,
		folderId: 'f3',
		tags: ['qa', 'manual']
	}
];

export const ALL_TAGS = [...new Set(BOOKMARKS.flatMap((b) => b.tags))].sort();

export type SortKey = 'newest' | 'title';

export function filterBookmarks(
	bookmarks: PrototypeBookmark[],
	q: string,
	favorite: boolean,
	tag: string,
	sort: SortKey,
	folderIds: Set<string> | null
): PrototypeBookmark[] {
	const query = q.trim().toLowerCase();
	const out = bookmarks.filter(
		(b) =>
			(!query || b.title.toLowerCase().includes(query) || b.url.toLowerCase().includes(query)) &&
			(!favorite || b.favorite) &&
			(tag === 'all' || b.tags.includes(tag)) &&
			(!folderIds || (b.folderId !== null && folderIds.has(b.folderId)))
	);
	return out.sort((a, b) =>
		sort === 'title' ? a.title.localeCompare(b.title) : b.createdAt.localeCompare(a.createdAt)
	);
}

export function withImages(
	bookmarks: PrototypeBookmark[],
	media: PrototypeMedia[]
): BookmarkView[] {
	return bookmarks.map((b) => ({ ...b, image: media.find((m) => m.id === b.imageId) ?? null }));
}

export function fallbackLetter(title: string): string {
	return title.trim().charAt(0).toUpperCase() || '?';
}

export function hostname(url: string): string {
	try {
		return new URL(url).hostname.replace(/^www\./, '');
	} catch {
		return url;
	}
}

export function folderPath(folders: PrototypeFolder[], id: string): PrototypeFolder[] {
	const path: PrototypeFolder[] = [];
	let current: PrototypeFolder | undefined = folders.find((f) => f.id === id);
	while (current) {
		path.unshift(current);
		const parentId: string | null = current.parentId;
		current = parentId ? folders.find((f) => f.id === parentId) : undefined;
	}
	return path;
}

export function folderLabel(folders: PrototypeFolder[], id: string): string {
	return folderPath(folders, id)
		.map((f) => f.name)
		.join(' / ');
}

export function folderIdsWithDescendants(folders: PrototypeFolder[], id: string): Set<string> {
	const ids = new Set<string>([id]);
	let grew = true;
	while (grew) {
		grew = false;
		for (const f of folders) {
			if (f.parentId && ids.has(f.parentId) && !ids.has(f.id)) {
				ids.add(f.id);
				grew = true;
			}
		}
	}
	return ids;
}

export function folderCounts(
	bookmarks: PrototypeBookmark[],
	folders: PrototypeFolder[]
): Record<string, number> {
	const counts: Record<string, number> = { all: bookmarks.length };
	for (const f of folders) {
		const ids = folderIdsWithDescendants(folders, f.id);
		counts[f.id] = bookmarks.filter((b) => b.folderId && ids.has(b.folderId)).length;
	}
	return counts;
}

export function formatBytes(bytes: number): string {
	return bytes >= 1024 * 1024
		? `${(bytes / (1024 * 1024)).toFixed(1)} MB`
		: `${Math.round(bytes / 1024)} KB`;
}
