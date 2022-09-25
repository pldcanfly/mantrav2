import { API } from '$lib/api';
import { speccTable } from '$store/tables';
import type { iCharacter } from 'src/app';

export interface Roster {
	tank: Array<iCharacter>;
	melee: Array<iCharacter>;
	ranged: Array<iCharacter>;
	heal: Array<iCharacter>;
}

export async function load() {
	const request = (await API({ url: '/characters' })).data.message as Array<iCharacter>;
	const roster: Roster = {
		tank: [],
		melee: [],
		ranged: [],
		heal: []
	};

	for (const char of request) {
		roster[speccTable[char.specc].role].push(char);
	}

	return {
		roster
	};
}
