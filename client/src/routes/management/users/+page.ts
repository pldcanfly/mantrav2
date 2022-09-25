import { API } from '$lib/api';
import { hasPerm } from '$store/session';
import { redirect } from '@sveltejs/kit';
import type { iUser } from 'src/app';

export async function load() {
	const request = await API({ url: '/users' });

	if (!hasPerm('usermanagement')) {
		throw redirect(307, '/raids');
		return;
	}

	return {
		users: request.data.message.map((user: iUser) => {
			user.password = '';
			return user;
		})
	};
}
