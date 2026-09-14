import { mkdir, rm } from 'node:fs/promises';
import { join, resolve } from 'node:path';
import { count, desc, eq } from 'drizzle-orm';
import { mediaUploadSchema } from '$lib/bookmarks/schemas';
import type { UploadMimeType } from '$lib/bookmarks/upload';
import { db } from './db';
import { bookmark, media } from './db/schema';
import { envSchema } from './env';

const uploadDir = resolve(envSchema.parse(process.env).UPLOAD_DIR ?? 'data/uploads');

const EXTENSIONS: Record<UploadMimeType, string> = {
	'image/jpeg': 'jpg',
	'image/png': 'png',
	'image/webp': 'webp'
};

export type MediaRow = typeof media.$inferSelect;
export type MediaWithUsage = MediaRow & { usageCount: number };

export type SaveMediaResult = { ok: true; media: MediaRow } | { ok: false; error: string };
export type DeleteMediaResult = { ok: true } | { ok: false; usageCount: number };

function mediaFilePath(storagePath: string): string {
	return join(uploadDir, storagePath);
}

export async function saveMedia(file: File): Promise<SaveMediaResult> {
	const parsed = mediaUploadSchema.safeParse(file);
	if (!parsed.success) {
		return { ok: false, error: parsed.error.issues[0]?.message ?? 'Invalid image.' };
	}

	const id = crypto.randomUUID();
	const storagePath = `${id}.${EXTENSIONS[file.type as UploadMimeType]}`;
	await mkdir(uploadDir, { recursive: true });
	await Bun.write(mediaFilePath(storagePath), file);

	try {
		const [row] = await db
			.insert(media)
			.values({
				id,
				originalName: file.name,
				mimeType: file.type,
				sizeBytes: file.size,
				storagePath
			})
			.returning();

		return { ok: true, media: row };
	} catch (error) {
		await rm(mediaFilePath(storagePath), { force: true });
		throw error;
	}
}

export async function listMedia(): Promise<MediaWithUsage[]> {
	return db
		.select({
			id: media.id,
			originalName: media.originalName,
			mimeType: media.mimeType,
			sizeBytes: media.sizeBytes,
			storagePath: media.storagePath,
			createdAt: media.createdAt,
			usageCount: count(bookmark.id)
		})
		.from(media)
		.leftJoin(bookmark, eq(bookmark.imageId, media.id))
		.groupBy(media.id)
		.orderBy(desc(media.createdAt));
}

export async function mediaUsageCount(id: string): Promise<number> {
	const [row] = await db
		.select({ usageCount: count() })
		.from(bookmark)
		.where(eq(bookmark.imageId, id));

	return row?.usageCount ?? 0;
}

export async function deleteMedia(id: string): Promise<DeleteMediaResult> {
	const usageCount = await mediaUsageCount(id);
	if (usageCount > 0) {
		return { ok: false, usageCount };
	}

	const [row] = await db.delete(media).where(eq(media.id, id)).returning();
	if (row) {
		await rm(mediaFilePath(row.storagePath), { force: true });
	}

	return { ok: true };
}

export async function getMediaFile(
	id: string
): Promise<{ body: Bun.BunFile; mimeType: string } | null> {
	const [row] = await db.select().from(media).where(eq(media.id, id));
	if (!row) {
		return null;
	}

	const file = Bun.file(mediaFilePath(row.storagePath));
	if (!(await file.exists())) {
		return null;
	}

	return { body: file, mimeType: row.mimeType };
}
