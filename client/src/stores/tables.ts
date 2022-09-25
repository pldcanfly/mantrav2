import warrior from '$icons/classicons/warrior.png';
import paladin from '$icons/classicons/paladin.png';
import hunter from '$icons/classicons/hunter.png';
import rogue from '$icons/classicons/rogue.png';
import priest from '$icons/classicons/priest.png';
import shaman from '$icons/classicons/shaman.png';
import mage from '$icons/classicons/mage.png';
import warlock from '$icons/classicons/warlock.png';
import druid from '$icons/classicons/druid.png';
import dk from '$icons/classicons/dk.jpg';
import unknown from '$icons/classicons/unknown.png';

interface ClassTable {
	warrior: ClassTableEntry;
	paladin: ClassTableEntry;
	hunter: ClassTableEntry;
	rogue: ClassTableEntry;
	priest: ClassTableEntry;
	shaman: ClassTableEntry;
	mage: ClassTableEntry;
	warlock: ClassTableEntry;
	druid: ClassTableEntry;
	deathknight: ClassTableEntry;
	unknown: ClassTableEntry;
}

interface ClassTableEntry {
	name: string;
	icon: string;
	color: string;
	speccs: Array<Specc>;
}

export const classTable: ClassTable = {
	warrior: {
		name: 'Warrior',
		color: '#C69B6D',
		icon: warrior,
		speccs: ['warms', 'wfury', 'wprot']
	},
	paladin: {
		name: 'Paladin',
		color: '#F48CBA',
		icon: paladin,
		speccs: ['pholy', 'pprot', 'pretri']
	},
	hunter: {
		name: 'Hunter',
		color: '#AAD372',
		icon: hunter,
		speccs: ['hbm', 'hmm', 'hsv']
	},
	rogue: {
		name: 'Rogue',
		color: '#FFF468',
		icon: rogue,
		speccs: ['rassa', 'rcombat', 'rsub']
	},
	priest: {
		name: 'Priest',
		color: '#FFFFFF',
		icon: priest,
		speccs: ['prdisc', 'pholy', 'prshadow']
	},
	shaman: {
		name: 'Shaman',
		color: '#0070DD',
		icon: shaman,
		speccs: ['sele', 'sench', 'sresto']
	},
	mage: {
		name: 'Mage',
		color: '#3FC7EB',
		icon: mage,
		speccs: ['marcane', 'mfire', 'mfrost']
	},
	warlock: {
		name: 'Warlock',
		color: '#8788EE',
		icon: warlock,
		speccs: ['waffli', 'wdemo', 'wdestro']
	},
	druid: {
		name: 'Druid',
		color: '#FF7C0A',
		icon: druid,
		speccs: ['dbalance', 'dferal', 'dresto', 'dbear']
	},
	deathknight: {
		name: 'Death Knight',
		color: '#e84655',
		icon: dk,
		speccs: ['dkblood', 'dkfrost', 'dkunholy']
	},
	unknown: {
		name: 'Unbekannt',
		color: '#fff',
		icon: unknown,
		speccs: ['unknown']
	}
};

import warms from '$icons/speccicons/warms.png';
import wfury from '$icons/speccicons/wfury.png';
import wprot from '$icons/speccicons/wprot.png';
import pholy from '$icons/speccicons/pholy.png';
import pprot from '$icons/speccicons/pprot.png';
import pretri from '$icons/speccicons/pretri.png';
import hbm from '$icons/speccicons/hbm.png';
import hmm from '$icons/speccicons/hmm.png';
import hsv from '$icons/speccicons/hsv.png';
import rassa from '$icons/speccicons/rassa.png';
import rcombat from '$icons/speccicons/rcombat.png';
import rsub from '$icons/speccicons/rsub.png';
import prdisc from '$icons/speccicons/prdisc.png';
import prshadow from '$icons/speccicons/prshadow.png';
import sele from '$icons/speccicons/sele.png';
import sench from '$icons/speccicons/sench.png';
import sresto from '$icons/speccicons/sresto.png';
import marcane from '$icons/speccicons/marcane.png';
import mfire from '$icons/speccicons/mfire.png';
import mfrost from '$icons/speccicons/mfrost.png';
import waffli from '$icons/speccicons/waffli.png';
import wdemo from '$icons/speccicons/wdemo.png';
import wdestro from '$icons/speccicons/wdestro.png';
import dbalance from '$icons/speccicons/dbalance.png';
import dferal from '$icons/speccicons/dferal.png';
import dresto from '$icons/speccicons/dresto.png';
import dbear from '$icons/speccicons/dbear.png';
import dkblood from '$icons/speccicons/dkblood.jpg';
import dkfrost from '$icons/speccicons/dkfrost.jpg';
import dkunholy from '$icons/speccicons/dkunholy.jpg';

interface SpeccTable {
	warms: SpeccTableEntry;
	wfury: SpeccTableEntry;
	wprot: SpeccTableEntry;
	pholy: SpeccTableEntry;
	pprot: SpeccTableEntry;
	pretri: SpeccTableEntry;
	hbm: SpeccTableEntry;
	hmm: SpeccTableEntry;
	hsv: SpeccTableEntry;
	rassa: SpeccTableEntry;
	rcombat: SpeccTableEntry;
	rsub: SpeccTableEntry;
	prdisc: SpeccTableEntry;
	prshadow: SpeccTableEntry;
	sele: SpeccTableEntry;
	sench: SpeccTableEntry;
	sresto: SpeccTableEntry;
	marcane: SpeccTableEntry;
	mfire: SpeccTableEntry;
	mfrost: SpeccTableEntry;
	waffli: SpeccTableEntry;
	wdemo: SpeccTableEntry;
	wdestro: SpeccTableEntry;
	dbalance: SpeccTableEntry;
	dferal: SpeccTableEntry;
	dresto: SpeccTableEntry;
	dbear: SpeccTableEntry;
	dkblood: SpeccTableEntry;
	dkfrost: SpeccTableEntry;
	dkunholy: SpeccTableEntry;
	unknown: SpeccTableEntry;
}

interface SpeccTableEntry {
	name: string;
	role: Role;
	icon: string;
}

type Role = 'melee' | 'ranged' | 'heal' | 'tank';

export const speccTable: SpeccTable = {
	warms: { name: 'Arms', role: 'melee', icon: warms },
	wfury: { name: 'Fury', role: 'melee', icon: wfury },
	wprot: { name: 'Protection', role: 'tank', icon: wprot },
	pholy: { name: 'Holy', role: 'heal', icon: pholy },
	pprot: { name: 'Protection', role: 'tank', icon: pprot },
	pretri: { name: 'Retribution', role: 'melee', icon: pretri },
	hbm: { name: 'Beast Mastery', role: 'ranged', icon: hbm },
	hmm: { name: 'Marksmanship', role: 'ranged', icon: hmm },
	hsv: { name: 'Survival', role: 'ranged', icon: hsv },
	rassa: { name: 'Assassination', role: 'melee', icon: rassa },
	rcombat: { name: 'Combat', role: 'melee', icon: rcombat },
	rsub: { name: 'Subtlety', role: 'melee', icon: rsub },
	prdisc: { name: 'Discipline', role: 'heal', icon: prdisc },
	prshadow: { name: 'Shadow', role: 'ranged', icon: prshadow },
	sele: { name: 'Elemental', role: 'ranged', icon: sele },
	sench: { name: 'Enhancement', role: 'melee', icon: sench },
	sresto: { name: 'Restoration', role: 'heal', icon: sresto },
	marcane: { name: 'Arcane', role: 'ranged', icon: marcane },
	mfire: { name: 'Fire', role: 'ranged', icon: mfire },
	mfrost: { name: 'Frost', role: 'tank', icon: mfrost },
	waffli: { name: 'Affliction', role: 'ranged', icon: waffli },
	wdemo: { name: 'Demonology', role: 'ranged', icon: wdemo },
	wdestro: { name: 'Destrution', role: 'ranged', icon: wdestro },
	dbalance: { name: 'Balance', role: 'ranged', icon: dbalance },
	dferal: { name: 'Feral (Cat)', role: 'melee', icon: dferal },
	dresto: { name: 'Restoration', role: 'heal', icon: dresto },
	dbear: { name: 'Feral (Tank)', role: 'tank', icon: dbear },
	dkblood: { name: 'Blood', role: 'tank', icon: dkblood },
	dkfrost: { name: 'Frost', role: 'melee', icon: dkfrost },
	dkunholy: { name: 'Unholy', role: 'melee', icon: dkunholy },
	unknown: { name: 'Unbekannt', role: 'melee', icon: unknown }
};

import orcf from '$icons/raceicons/orcf.png';
import orcm from '$icons/raceicons/orcm.png';
import taurenm from '$icons/raceicons/taurenm.png';
import taurenf from '$icons/raceicons/taurenf.png';
import trollm from '$icons/raceicons/trollm.png';
import trollf from '$icons/raceicons/trollf.png';
import undeadm from '$icons/raceicons/undeadm.png';
import undeadf from '$icons/raceicons/undeadf.png';
import bem from '$icons/raceicons/bem.png';
import bef from '$icons/raceicons/bef.png';

interface RaceTable {
	orc: RaceTableEntry;
	tauren: RaceTableEntry;
	troll: RaceTableEntry;
	undead: RaceTableEntry;
	bloodelf: RaceTableEntry;
	unknown: RaceTableEntry;
}

interface RaceTableEntry {
	name: string;
	icon: {
		male: string;
		female: string;
	};
	classes: Array<Clazz>;
}

export const raceTable: RaceTable = {
	orc: {
		name: 'Orc',
		icon: {
			male: orcm,
			female: orcf
		},
		classes: ['deathknight', 'warrior', 'shaman', 'hunter', 'rogue', 'warlock']
	},
	tauren: {
		name: 'Tauren',
		icon: {
			male: taurenm,
			female: taurenf
		},
		classes: ['deathknight', 'warrior', 'shaman', 'hunter', 'druid']
	},
	troll: {
		name: 'Troll',
		icon: {
			male: trollm,
			female: trollf
		},
		classes: ['deathknight', 'warrior', 'shaman', 'hunter', 'mage', 'priest', 'rogue']
	},
	undead: {
		name: 'Undead',
		icon: {
			male: undeadm,
			female: undeadf
		},
		classes: ['deathknight', 'warrior', 'mage', 'priest', 'rogue', 'warlock']
	},
	bloodelf: {
		name: 'Blood Elf',
		icon: {
			male: bem,
			female: bef
		},
		classes: ['deathknight', 'hunter', 'mage', 'paladin', 'priest', 'rogue', 'warlock']
	},
	unknown: {
		name: 'Unbekannt',
		icon: {
			male: unknown,
			female: unknown
		},
		classes: ['unknown']
	}
};

import type { Clazz, Specc } from 'src/app';

import archimonde from '$icons/icons/archimonde.png';
import grulls from '$icons/icons/grulls.png';
import illidan from '$icons/icons/illidan.png';
import kara from '$icons/icons/kara.png';
import keal from '$icons/icons/keal.png';
import kj from '$icons/icons/kj.png';
import naxx from '$icons/icons/naxx.png';
import vashij from '$icons/icons/vashij.png';

import anub from '$icons/icons/anub.png';
import arthas from '$icons/icons/arthas.png';
import malygos from '$icons/icons/malygos.png';
import obsi from '$icons/icons/obsi.png';
import yogg from '$icons/icons/yogg.png';
import ony from '$icons/icons/ony.png';

export const icons = new Map([
	['anub', anub],
	['arthas', arthas],
	['malygos', malygos],
	['obsi', obsi],
	['yogg', yogg],
	['ony', ony],
	['archimonde', archimonde],
	['grulls', grulls],
	['illidan', illidan],
	['kara', kara],
	['keal', keal],
	['kj', kj],
	['naxx', naxx],
	['vashij', vashij],
	['unknown', unknown]
]);
