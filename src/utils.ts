import { NeonDatabase } from 'drizzle-orm/neon-serverless';
import { beasts } from './db/schema';

export async function cacheData(db: NeonDatabase<Record<string, never>>, namespace: KVNamespace) {
	const response = await db.select().from(beasts);
	return await namespace.put('BEASTS', JSON.stringify(response)).then(() => new Response('Data successfully cached!', { status: 201 }));
}

export async function getCachedData(namespace: KVNamespace) {
	const response = await namespace.get('BEASTS');
	if (!response) return new Response("Couldn't get data", { status: 404 });
	return JSON.parse(response);
}

export async function getPaginatedCachedData(namespace: KVNamespace, offset: number, limit: number) {
	const data = await getCachedData(namespace);
	return data.slice(offset, limit + offset);
}
