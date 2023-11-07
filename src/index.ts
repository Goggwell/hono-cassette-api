import { drizzle } from 'drizzle-orm/neon-serverless';
import { Pool } from '@neondatabase/serverless';
import { beasts } from './db/schema';
import { Hono } from 'hono';
import { cache } from 'hono/cache';

export type Env = {
	DATABASE_URL: string;
};

const app = new Hono<{ Bindings: Env }>();

app.get(
	'*',
	cache({
		cacheName: 'hono-cassette-api',
		wait: true,
		cacheControl: 'max-age=3600, s-maxage=3600, stale-while-revalidate=60, stale-if-error=86400',
	})
);

app.get('/', async (c) => {
	try {
		const client = new Pool({ connectionString: c.env.DATABASE_URL });
		const db = drizzle(client);
		const result = await db.select().from(beasts);

		return c.json({
			result,
		});
	} catch (error) {
		console.error(error);
		return c.json(
			{
				error,
			},
			400
		);
	}
});

export default app;
