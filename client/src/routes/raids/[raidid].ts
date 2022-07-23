export interface iRaid {
	id: number;
	name: string;
	description: string;
	icon: iIcons;
	date: string;
	size: number;
	signups: Array<iSignup>;
}

export interface iSignup {
	state: 'invited' | 'accepted' | 'declined' | 'benched';
	position: number;
	comment?: string;
	character: iCharacter;
	actions: boolean;
}

export async function get({ params }: { params: any }) {
	const raids: Array<iRaid> = [
		{
			id: 1,
			name: 'Toller Raid',
			date: '2022-07-12T18:00:52.405Z',
			description: 'Beschreibung',
			icon: 'naxx',
			size: 25,
			signups: [
				{
					state: 'declined',
					position: -1,
					actions: false,
					character: {
						id: 1,
						name: 'Feralface',
						clazz: 'druid',
						specc: 'dferal',
						offspecc: 'dbear',
						race: 'tauren',
						female: true
					}
				},
				{
					state: 'accepted',
					position: -1,
					actions: false,
					comment: 'Dies ist ein Test.\nMit mehreren Zeilen!\n\n aber ohne <span>html</span>',
					character: {
						id: 2,
						name: 'Bishop',
						clazz: 'priest',
						specc: 'prshadow',
						offspecc: 'pholy',
						race: 'undead',
						female: false
					}
				},
				{
					state: 'accepted',
					position: -1,
					actions: false,
					comment: 'Dies ist ein Test.\nMit mehreren Zeilen!\n\n aber ohne <span>html</span>',
					character: {
						id: 3,
						name: 'Bishop2',
						clazz: 'priest',
						specc: 'prshadow',
						offspecc: 'pholy',
						race: 'undead',
						female: false
					}
				},
				{
					state: 'accepted',
					position: -1,
					actions: false,
					comment: 'Dies ist ein Test.\nMit mehreren Zeilen!\n\n aber ohne <span>html</span>',
					character: {
						id: 4,
						name: 'Bishop3',
						clazz: 'priest',
						specc: 'prshadow',
						offspecc: 'pholy',
						race: 'undead',
						female: false
					}
				},
				{
					state: 'invited',
					position: -1,
					actions: true,

					character: {
						id: 5,
						name: 'Kessedy',
						clazz: 'deathknight',
						specc: 'dkblood',
						offspecc: 'dkfrost',
						race: 'bloodelf',
						female: true
					}
				},
				{
					state: 'accepted',
					position: -2,
					actions: false,
					character: {
						id: 6,
						name: 'Boomkin',
						clazz: 'druid',
						specc: 'dbalance',
						offspecc: 'dbear',
						race: 'tauren',
						female: true
					}
				}
			]
		},
		{
			id: 2,
			name: 'Toller Zweit-Raid',
			date: '2022-07-12T18:00:52.405Z',
			description: 'Beschreibung',
			icon: 'illidan',
			size: 10,
			signups: []
		}
	];

	const raid = raids.find((item) => item.id === parseInt(params.raidid));
	return {
		body: {
			raid
		}
	};
}
