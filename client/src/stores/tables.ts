type ClassTable = {
	[propName: number]: ClassItem;
};

type ClassItem = {
	name: string;
	color: string;
	picture: string;
	speccs: SpeccTable;
};

type SpeccTable = {
	1: SpeccItem;
	2: SpeccItem;
	3: SpeccItem;
	4?: SpeccItem;
};

type SpeccItem = {
	name: string;
	role: 'ranged' | 'melee' | 'heal' | 'tank';
	picture: string;
};

export const classTable: ClassTable = {
	1: {
		name: 'Warrior',
		color: '#C69B6D',
		picture: 'classicons/warrior.png',
		speccs: {
			1: { name: 'Arms', role: 'melee', picture: 'speccicons/warms.png' },
			2: { name: 'Fury', role: 'melee', picture: 'speccicons/wfury.png' },
			3: { name: 'Protection', role: 'tank', picture: 'speccicons/wprot.png' }
		}
	},
	2: {
		name: 'Paladin',
		color: '#F48CBA',
		picture: 'classicons/paladin.png',
		speccs: {
			1: { name: 'Holy', role: 'heal', picture: 'speccicons/pholy.png' },
			2: { name: 'Protection', role: 'tank', picture: 'speccicons/pprot.png' },
			3: { name: 'Retribution', role: 'melee', picture: 'speccicons/pretri.png' }
		}
	},
	3: {
		name: 'Hunter',
		color: '#AAD372',
		picture: 'classicons/hunter.png',
		speccs: {
			1: { name: 'Beast Mastery', role: 'ranged', picture: 'speccicons/hbm.png' },
			2: { name: 'Marksmanship', role: 'ranged', picture: 'speccicons/hmm.png' },
			3: { name: 'Survival', role: 'ranged', picture: 'speccicons/hsv.png' }
		}
	},
	4: {
		name: 'Rogue',
		color: '#FFF468',
		picture: 'classicons/rogue.png',
		speccs: {
			1: { name: 'Assassination', role: 'melee', picture: 'speccicons/rassa.png' },
			2: { name: 'Combat', role: 'melee', picture: 'speccicons/rcombat.png' },
			3: { name: 'Subtlety', role: 'melee', picture: 'speccicons/rsub.png' }
		}
	},
	5: {
		name: 'Priest',
		color: '#FFFFFF',
		picture: 'classicons/priest.png',
		speccs: {
			1: { name: 'Discipline', role: 'heal', picture: 'speccicons/prdisc.png' },
			2: { name: 'Holy', role: 'heal', picture: 'speccicons/pholy.png' },
			3: { name: 'Shadow', role: 'ranged', picture: 'speccicons/prshadow.png' }
		}
	},
	6: {
		name: 'Shaman',
		color: '#0070DD',
		picture: 'classicons/shaman.png',
		speccs: {
			1: { name: 'Elemental', role: 'ranged', picture: 'speccicons/sele.png' },
			2: { name: 'Enhancement', role: 'melee', picture: 'speccicons/sench.png' },
			3: { name: 'Restoration', role: 'heal', picture: 'speccicons/sresto.png' }
		}
	},
	7: {
		name: 'Mage',
		color: '#3FC7EB',
		picture: 'classicons/mage.png',
		speccs: {
			1: { name: 'Arcane', role: 'ranged', picture: 'speccicons/marcane.png' },
			2: { name: 'Fire', role: 'ranged', picture: 'speccicons/mfire.png' },
			3: { name: 'Frost', role: 'tank', picture: 'speccicons/mfrost.png' }
		}
	},
	8: {
		name: 'Warlock',
		color: '#8788EE',
		picture: 'classicons/warlock.png',
		speccs: {
			1: { name: 'Affliction', role: 'ranged', picture: 'speccicons/waffli.png' },
			2: { name: 'Demonology', role: 'ranged', picture: 'speccicons/wdemo.png' },
			3: { name: 'Destrution', role: 'ranged', picture: 'speccicons/wdestro.png' }
		}
	},
	9: {
		name: 'Druid',
		color: '#FF7C0A',
		picture: 'classicons/druid.png',
		speccs: {
			1: { name: 'Balance', role: 'ranged', picture: 'speccicons/dbalance.png' },
			2: { name: 'Feral (Cat)', role: 'melee', picture: 'speccicons/dferal.png' },
			3: { name: 'Restoration', role: 'heal', picture: 'speccicons/dresto.png' },
			4: { name: 'Feral (Tank)', role: 'tank', picture: 'speccicons/dbear.png' }
		}
	}
};
