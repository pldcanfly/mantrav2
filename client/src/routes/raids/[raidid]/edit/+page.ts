import { API } from '$lib/api';
import { hasPerm } from '$store/session';
import { redirect } from '@sveltejs/kit';
import type { iRaid } from 'src/app';

export async function load({ params }: { params: { raidid: string } }) {
	if (!hasPerm('raidmanagement')) {
		throw redirect(307, '/raids');
		return;
	}

	const raid: iRaid = (await API({ url: `/raids/${params.raidid}` })).data.message;

	return {
		raid
	};
}
