import { z } from 'zod';

// Kept alias-free so drizzle-kit can load it outside SvelteKit (see drizzle.config.ts).
export const envSchema = z.object({
	DATABASE_URL: z.string().min(1, 'DATABASE_URL is required'),
	UPLOAD_DIR: z.string().min(1).optional()
});
