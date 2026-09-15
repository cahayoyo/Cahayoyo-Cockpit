import { z } from 'zod';
import { parseTags } from './tags';
import { validateUpload } from './upload';

export const bookmarkFormSchema = z.object({
	title: z.string().trim().min(1, 'Title is required.').max(200, 'Title is too long.'),
	url: z.url({ protocol: /^https?$/ }).max(2048, 'URL is too long.'),
	description: z.string().trim().max(2000, 'Description is too long.'),
	favorite: z.boolean(),
	folderId: z.uuid().nullable(),
	imageId: z.uuid().nullable(),
	tags: z.string().transform(parseTags)
});

export type BookmarkFormInput = z.infer<typeof bookmarkFormSchema>;

export const folderFormSchema = z.object({
	name: z.string().trim().min(1, 'Name is required.').max(100, 'Name is too long.'),
	parentId: z.uuid().nullable()
});

export type FolderFormInput = z.infer<typeof folderFormSchema>;

export const mediaUploadSchema = z.file().superRefine((file, ctx) => {
	const error = validateUpload(file);
	if (error) {
		ctx.addIssue({ code: 'custom', message: error });
	}
});
