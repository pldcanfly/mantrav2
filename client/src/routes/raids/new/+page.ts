import { hasPerm } from '$store/session';
import { redirect } from '@sveltejs/kit';

export async function load() {
	if (!hasPerm('raidmanagement')) {
		throw redirect(307, '/raids');
		return;
	}
}
