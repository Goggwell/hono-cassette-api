export type SimplifiedMonster = {
	id: string | null;
	name: string | null;
	image: string | null;
	requirement: string | null;
};

export type RemasteredMonster = {
	monsters: SimplifiedMonster[] | null;
};

export type BaseStats = {
	max_hp: number;
	m_atk: number;
	m_def: number;
	r_atk: number;
	r_def: number;
	speed: number;
};

export type Images = {
	standard: string | null;
	animated: string | null;
	sticker: string | null;
};

export type Monster = {
	id: number;
	beastid: string | null;
	name: string | null;
	type: string | null;
	remaster_from: RemasteredMonster | null;
	remaster_to: RemasteredMonster | null;
	base_stats: BaseStats | null;
	description: string | null;
	images: Images | null;
	cry: string | null;
};
