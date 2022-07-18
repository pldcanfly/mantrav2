export interface Roster {
	tank: Array<iCharacter>;
	melee: Array<iCharacter>;
	ranged: Array<iCharacter>;
	heal: Array<iCharacter>;
}

export async function get() {
	const roster: Roster = {
		melee: [
			{
				id: 1,
				name: 'Feralface',
				clazz: 'druid',
				specc: 'dferal',
				offspecc: 'dbear',
				race: 'tauren',
				female: true
			},

			{
				id: 1,
				name: 'Beralface',
				clazz: 'druid',
				specc: 'dbalance',

				race: 'tauren',
				female: true
			},
			{
				id: 1,
				name: 'Feralface',
				clazz: 'druid',
				specc: 'dresto',
				offspecc: 'dferal',
				race: 'tauren',
				female: false
			}
		],
		ranged: [
			{
				id: 1,
				name: 'Bishop',
				clazz: 'priest',
				specc: 'prshadow',
				offspecc: 'pholy',
				race: 'undead',
				female: false
			}
		],
		tank: [
			{
				id: 1,
				name: 'Kessedy',
				clazz: 'deathknight',
				specc: 'dkblood',
				offspecc: 'dkfrost',
				race: 'bloodelf',
				female: true
			},
			{
				id: 1,
				name: 'Tankface',
				clazz: 'warrior',
				specc: 'wprot',
				race: 'orc',
				female: false
			}
		],
		heal: []
	};

	return {
		body: {
			roster
		}
	};
}
