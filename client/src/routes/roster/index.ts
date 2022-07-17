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
				name: 'Feralface',
				clazz: 'druid',
				specc: 'dferal',
				offspecc: 'dbear',
				race: 'tauren',
				female: true
			},

			{
				name: 'Beralface',
				clazz: 'druid',
				specc: 'dbalance',

				race: 'tauren',
				female: true
			},
			{
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
				name: 'Kessedy',
				clazz: 'deathknight',
				specc: 'dkblood',
				offspecc: 'dkfrost',
				race: 'bloodelf',
				female: true
			},
			{
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
