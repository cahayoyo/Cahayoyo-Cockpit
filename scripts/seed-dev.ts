import { z } from 'zod';
// Relative imports on purpose: this script runs outside SvelteKit, where the
// `$lib` alias is not resolvable.
import { auth } from '../src/lib/server/auth';

// Dev-only credentials: set them in .env (never committed) — see .env.example.
const seedEnvSchema = z.object({
	SEED_ADMIN_EMAIL: z.string().trim().pipe(z.email()),
	SEED_ADMIN_PASSWORD: z.string().min(12, 'SEED_ADMIN_PASSWORD must be at least 12 characters'),
	SEED_TEST_EMAIL: z.string().trim().pipe(z.email()),
	SEED_TEST_PASSWORD: z.string().min(12, 'SEED_TEST_PASSWORD must be at least 12 characters')
});

// The test account must never exist in production (CONSTITUTION, single-tenant).
function assertDevDatabase(): void {
	if (process.env.NODE_ENV === 'production') {
		throw new Error('Refusing to seed: NODE_ENV=production.');
	}
	if (/prod/i.test(process.env.DATABASE_URL ?? '')) {
		throw new Error('Refusing to seed: DATABASE_URL looks like a production database.');
	}
}

assertDevDatabase();
const env = seedEnvSchema.parse(process.env);
const ctx = await auth.$context;

async function upsertSeedUser(
	email: string,
	password: string,
	name: string
): Promise<'created' | 'updated'> {
	const existing = await ctx.internalAdapter.findUserByEmail(email, { includeAccounts: true });
	const passwordHash = await ctx.password.hash(password);

	if (!existing) {
		const user = await ctx.internalAdapter.createUser(
			{ email, name, emailVerified: true },
			{ method: 'email-password' }
		);
		await ctx.internalAdapter.createAccount({
			userId: user.id,
			accountId: user.id,
			providerId: 'credential',
			password: passwordHash
		});
		return 'created';
	}

	await ctx.internalAdapter.updateUser(existing.user.id, { name, emailVerified: true });
	const credentialAccount = existing.accounts.find(
		(account) => account.providerId === 'credential'
	);
	if (credentialAccount) {
		await ctx.internalAdapter.updateAccount(credentialAccount.id, { password: passwordHash });
	} else {
		await ctx.internalAdapter.createAccount({
			userId: existing.user.id,
			accountId: existing.user.id,
			providerId: 'credential',
			password: passwordHash
		});
	}
	return 'updated';
}

const admin = await upsertSeedUser(env.SEED_ADMIN_EMAIL, env.SEED_ADMIN_PASSWORD, 'Admin');
const test = await upsertSeedUser(env.SEED_TEST_EMAIL, env.SEED_TEST_PASSWORD, 'Test User');

console.log(`seeded: admin account ${admin}, test account ${test}.`);
