import type { iRaid } from './[raidid]';

export async function get() {
	const raids: Array<iRaid> = [
		{
			id: 1,
			name: 'Toller Raid',
			date: '2022-07-12T18:00:52.405Z',
			description: 'Beschreibung',
			icon: 'naxx.png',
			size: 25
		},
		{
			id: 2,
			name: 'Toller Zweit-Raid',
			date: '2022-07-12T18:00:52.405Z',
			description: 'Beschreibung',
			icon: 'illidan.png',
			size: 10
		}
	];

	return {
		body: {
			raids
		}
	};
}
