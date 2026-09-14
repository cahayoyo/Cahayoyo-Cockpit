import { z } from 'zod';
import { ROOT_FOLDER_ID, SORT_KEYS, type BookmarkFilters } from './filters';

export const bookmarkSearchSchema = z.object({
	q: z.string().trim().catch(''),
	favorite: z
		.enum(['true', 'false'])
		.catch('false')
		.transform((value) => value === 'true'),
	tag: z.string().trim().toLowerCase().catch(''),
	sort: z.enum(SORT_KEYS).catch('newest'),
	folder: z.uuid().catch('')
});

// Unknown or malformed params degrade to the safe default: no search, no
// filters, newest first, root folder (unfiled bookmarks).
export function parseBookmarkSearch(params: URLSearchParams): BookmarkFilters {
	const parsed = bookmarkSearchSchema.parse({
		q: params.get('q') ?? '',
		favorite: params.get('favorite') ?? 'false',
		tag: params.get('tag') ?? '',
		sort: params.get('sort') ?? 'newest',
		folder: params.get('folder') ?? ''
	});

	return {
		q: parsed.q,
		favorite: parsed.favorite,
		tag: parsed.tag || null,
		sort: parsed.sort,
		folderId: parsed.folder || ROOT_FOLDER_ID
	};
}
