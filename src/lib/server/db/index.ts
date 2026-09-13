import { drizzle } from 'drizzle-orm/bun-sql';
import { env } from '$env/dynamic/private';
import { envSchema } from '../env';

export const db = drizzle(envSchema.parse(env).DATABASE_URL);
