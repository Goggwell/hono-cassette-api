import { eq } from 'drizzle-orm';
import { NeonDatabase } from 'drizzle-orm/neon-serverless';
import { beasts } from './db/schema';
import { Monster } from './types';

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
	const data: Monster[] = await getCachedData(namespace);
	return data.slice(offset, limit + offset);
}

export async function getMonsterByName(namespace: KVNamespace, name: string) {
	const data: Monster[] = await getCachedData(namespace);
	const parsedName = name.toLowerCase();
	return data.filter((monster) => monster.name!.indexOf(parsedName) > -1);
}

export async function filterMonstersByType(namespace: KVNamespace, type: string) {
	const data: Monster[] = await getCachedData(namespace);
	const parsedType = type.toLowerCase();
	return data.filter((monster) => monster.type!.indexOf(parsedType) > -1);
}
