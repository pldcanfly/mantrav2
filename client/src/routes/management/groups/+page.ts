import { API } from '$lib/api';
import { hasPerm } from '$store/session';
import { redirect } from '@sveltejs/kit';

export async function load() {
	const request = await API({ url: '/groups' });

	if (!hasPerm('groupmanagement')) {
		throw redirect(307, '/raids');
		return;
	}

	return {
		groups: request.data.message
	};
}
