import { drizzle } from 'drizzle-orm/neon-serverless';
import { Pool } from '@neondatabase/serverless';
import { beasts } from './db/schema';
import { Hono } from 'hono';
import { cache } from 'hono/cache';
import { cacheData, getCachedData } from './utils';

export type Env = {
	DATABASE_URL: string;
	hcbkv: KVNamespace;
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
		const data = await getCachedData(c.env.hcbkv);

		return c.json({
			data,
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

app.get('/update', async (c) => {
	// const client = new Pool({ connectionString: c.env.DATABASE_URL });
	// const db = drizzle(client);
	// const response = await db.select().from(beasts);
	// console.log('response');
	// await c.env.hcbkv.put('BEASTS', JSON.stringify(response)).then(() => console.log('works!'));
	try {
		const client = new Pool({ connectionString: c.env.DATABASE_URL });
		const db = drizzle(client);
		return await cacheData(db, c.env.hcbkv);
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
