import { API } from '$lib/api';
import { accountid } from '$store/session';
import { redirect } from '@sveltejs/kit';
import type { iCharacter } from 'src/app';
import { get } from 'svelte/store';

export async function load() {
	let characters: Array<iCharacter> = [];

	if (get(accountid) == 0) {
		throw redirect(307, '/raids');
		return;
	}

	characters = (await API({ url: '/characters/mine' })).data.message as Array<iCharacter>;

	return {
		characters
	};
}
