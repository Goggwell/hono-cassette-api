import { drizzle } from 'drizzle-orm/neon-serverless';
import { Pool } from '@neondatabase/serverless';
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { cache } from 'hono/cache';
import { cacheData, getCachedData, getPaginatedCachedData, getMonsterByName, filterMonstersByType } from './utils';
import { Monster } from './types';

export type Env = {
	DATABASE_URL: string;
	compendium: KVNamespace;
};

const app = new Hono<{ Bindings: Env }>();

app.use(
	'/*',
	cors({
		origin: '*',
		allowMethods: ['POST', 'GET', 'OPTIONS', 'HEAD'],
		maxAge: 3600,
	})
);

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
		const data: Monster[] = await getCachedData(c.env.hcbkv);

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

app.get('/api', async (c) => {
	try {
		const data: Monster[] = await getCachedData(c.env.hcbkv);

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

app.get('/paginate', async (c) => {
	try {
		const { offset, limit } = c.req.query();
		const paginatedData: Monster[] = await getPaginatedCachedData(c.env.hcbkv, parseInt(offset), parseInt(limit));

		return c.json({
			paginatedData,
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

app.get('/name', async (c) => {
	try {
		const { name } = c.req.query();
		const result: Monster[] = await getMonsterByName(c.env.hcbkv, name);

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

app.get('/type', async (c) => {
	try {
		const { type } = c.req.query();
		const result: Monster[] = await filterMonstersByType(c.env.hcbkv, type);

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

app.get('/update', async (c) => {
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

app.get('/health', async (c) => {
	try {
		return c.text('Healthy!');
	} catch (error) {
		console.error(error, 'Unhealthy...');
		return c.json(
			{
				error,
			},
			400
		);
	}
});

export default app;
