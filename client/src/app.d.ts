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
	id: number;
	name: string;
	race: Race;
	clazz: Clazz;
	specc: Specc;
	offspecc?: Specc;
	female: boolean;
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
	| 'deathknight';

type Race = 'orc' | 'tauren' | 'troll' | 'undead' | 'bloodelf';

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
	| 'dkunholy';

type iIcons = 'archimonde' | 'grulls' | 'illidan' | 'kara' | 'keal' | 'kj' | 'naxx' | 'vashij';
