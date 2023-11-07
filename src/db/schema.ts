import { pgTable, serial, varchar, text, json } from 'drizzle-orm/pg-core';

export const beasts = pgTable('beasts', {
	id: serial('id').primaryKey(),
	beastid: varchar('beastid'),
	name: text('name'),
	type: text('type'),
	remaster_from: json('remaster_from'),
	remaster_to: json('remaster_to'),
	base_stats: json('base_stats'),
	description: text('description'),
	images: json('images'),
});
