import { asc, eq, inArray } from 'drizzle-orm';
import type { BookmarkFormInput, FolderFormInput } from '$lib/bookmarks/schemas';
import { db } from './db';
import { bookmark, bookmarkTag, folder, tag } from './db/schema';

export type BookmarkListItem = typeof bookmark.$inferSelect & { tags: string[] };
export type FolderListItem = typeof folder.$inferSelect;

type Transaction = Parameters<Parameters<typeof db.transaction>[0]>[0];

export async function listBookmarks(): Promise<BookmarkListItem[]> {
	const rows = await db.select().from(bookmark).orderBy(asc(bookmark.createdAt));
	if (rows.length === 0) {
		return [];
	}

	const links = await db
		.select({ bookmarkId: bookmarkTag.bookmarkId, name: tag.name })
		.from(bookmarkTag)
		.innerJoin(tag, eq(bookmarkTag.tagId, tag.id))
		.orderBy(asc(tag.name));

	const tagsByBookmark = new Map<string, string[]>();
	for (const link of links) {
		const names = tagsByBookmark.get(link.bookmarkId) ?? [];
		names.push(link.name);
		tagsByBookmark.set(link.bookmarkId, names);
	}

	return rows.map((row) => ({ ...row, tags: tagsByBookmark.get(row.id) ?? [] }));
}

export async function listFolders(): Promise<FolderListItem[]> {
	return db.select().from(folder).orderBy(asc(folder.name));
}

export async function listTags(): Promise<string[]> {
	const rows = await db.select({ name: tag.name }).from(tag).orderBy(asc(tag.name));
	return rows.map((row) => row.name);
}

async function attachTags(tx: Transaction, bookmarkId: string, names: string[]): Promise<void> {
	if (names.length === 0) {
		return;
	}

	for (const name of names) {
		await tx.insert(tag).values({ name }).onConflictDoNothing({ target: tag.name });
	}

	const rows = await tx.select({ id: tag.id }).from(tag).where(inArray(tag.name, names));
	await tx.insert(bookmarkTag).values(rows.map((row) => ({ bookmarkId, tagId: row.id })));
}

function bookmarkValues(input: BookmarkFormInput) {
	return {
		title: input.title,
		url: input.url,
		description: input.description || null,
		favorite: input.favorite,
		folderId: input.folderId,
		imageId: input.imageId
	};
}

export async function createBookmark(input: BookmarkFormInput): Promise<string> {
	return db.transaction(async (tx) => {
		const [row] = await tx
			.insert(bookmark)
			.values(bookmarkValues(input))
			.returning({ id: bookmark.id });

		await attachTags(tx, row.id, input.tags);
		return row.id;
	});
}

export async function updateBookmark(id: string, input: BookmarkFormInput): Promise<boolean> {
	return db.transaction(async (tx) => {
		const updated = await tx
			.update(bookmark)
			.set(bookmarkValues(input))
			.where(eq(bookmark.id, id))
			.returning({ id: bookmark.id });

		if (updated.length === 0) {
			return false;
		}

		await tx.delete(bookmarkTag).where(eq(bookmarkTag.bookmarkId, id));
		await attachTags(tx, id, input.tags);
		return true;
	});
}

export async function deleteBookmark(id: string): Promise<void> {
	await db.delete(bookmark).where(eq(bookmark.id, id));
}

export async function setBookmarkFavorite(id: string, favorite: boolean): Promise<void> {
	await db.update(bookmark).set({ favorite }).where(eq(bookmark.id, id));
}

export async function createFolder(input: FolderFormInput): Promise<string> {
	const [row] = await db
		.insert(folder)
		.values({ name: input.name, parentId: input.parentId })
		.returning({ id: folder.id });

	return row.id;
}

export async function renameFolder(id: string, name: string): Promise<void> {
	await db.update(folder).set({ name }).where(eq(folder.id, id));
}

export async function deleteFolder(id: string): Promise<void> {
	// Subtree removal and unfiling of contained bookmarks happen in the DB's
	// FK actions (folder.parent_id CASCADE, bookmark.folder_id SET NULL).
	await db.delete(folder).where(eq(folder.id, id));
}
