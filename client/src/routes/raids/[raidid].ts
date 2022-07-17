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
					character: {
						name: 'Bishop',
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
					comment: 'Ballern alter!',
					character: {
						name: 'Kessedy',
						clazz: 'deathknight',
						specc: 'dkblood',
						offspecc: 'dkfrost',
						race: 'bloodelf',
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
