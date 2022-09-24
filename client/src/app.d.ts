/// <reference types="@sveltejs/kit" />

// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
// and what to do when importing types
declare namespace App {
	// interface Locals {}
	// interface Platform {}
	// interface Session {}
	// interface Stuff {}
}

interface iCharacter {
	id: string;
	name: string;
	race: Race;
	clazz: Clazz;
	specc: Specc;
	offspecc?: Specc;
	female: boolean;
	accountid: string;
}

interface iGroup {
	id: number;
	name: string;
	members: Array<iCharacter>;
}

export interface iRaid {
	id?: number;
	name: string;
	description: string;
	icon: iIcons;
	date: string;
	size: number;
	signups: Array<iSignup>;
}

export interface iSignup {
	state: 'invited' | 'accepted' | 'declined';
	position: number;
	comment?: string;
	character: iCharacter;
}

type Clazz =
	| 'warrior'
	| 'paladin'
	| 'hunter'
	| 'rogue'
	| 'priest'
	| 'shaman'
	| 'mage'
	| 'warlock'
	| 'druid'
	| 'deathknight'
	| 'unknown';

type Race = 'orc' | 'tauren' | 'troll' | 'undead' | 'bloodelf' | 'unknown';

type Specc =
	| 'warms'
	| 'wfury'
	| 'wprot'
	| 'pholy'
	| 'pprot'
	| 'pretri'
	| 'hbm'
	| 'hmm'
	| 'hsv'
	| 'rassa'
	| 'rcombat'
	| 'rsub'
	| 'prdisc'
	| 'prshadow'
	| 'sele'
	| 'sench'
	| 'sresto'
	| 'marcane'
	| 'mfire'
	| 'mfrost'
	| 'waffli'
	| 'wdemo'
	| 'wdestro'
	| 'dbalance'
	| 'dferal'
	| 'dresto'
	| 'dbear'
	| 'dkblood'
	| 'dkfrost'
	| 'dkunholy'
	| 'unknown';

type iIcons = string;

export interface iUser {
	id?: string;
	username: string;
	password: string;
	open?: boolean;
}
