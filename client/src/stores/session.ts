import decode from 'jwt-decode';
import { browser } from '$app/env';
import { writable, get } from 'svelte/store';
import { z } from 'zod';
import { API, type APIResult } from '$lib/api';

interface AccessTokenPayload {
	id: number;
	username: string;
	roles: Array<string>;
	perms: Array<string>;
	iat: number;
	exp: number;
}

interface RefreshTokenPayload {
	id: number;
	iat: number;
	exp: number;
}

interface SessionState {
	id: number;
	username: string;
	roles: Set<string>;
	perms: Set<string>;
	iat: number;
	exp: number;
}

const accessToken = browser ? localStorage.getItem('accessToken') : null;
const refreshToken = browser ? localStorage.getItem('refreshToken') : null;

const parseToken = (token: string) => {
	try {
		const decoded = z
			.object({
				id: z.string(),
				username: z.string(),
				roles: z.string().array(),
				perms: z.string().array(),
				iat: z.number(),
				exp: z.number()
			})
			.parse(decode(token));

		return {
			...decoded,
			roles: new Set(decoded.roles),
			perms: new Set(decoded.perms),
			id: parseInt(decoded.id)
		};
	} catch (e) {
		console.error(e);
	}
};

const initialstate = (): SessionState | undefined => {
	if (accessToken === null || refreshToken === null) return undefined;
	return parseToken(accessToken);
};

const state = writable<SessionState | undefined>(initialstate());

const logout = () => {
	if (!browser) return false;
	localStorage.removeItem('accessToken');
	localStorage.removeItem('refreshToken');
	state.set(undefined);
};

const login = async (username: string, password: string) => {
	if (!browser) return false;
	return API({ method: 'post', url: '/auth/login', data: { username, password } })
		.then((res: APIResult) => {
			console.log(res);
			localStorage.setItem('accessToken', res.data.message.accessToken);
			localStorage.setItem('refreshToken', res.data.message.refreshToken);
			state.set(parseToken(res.data.message.accessToken));
			console.log('login', parseToken(res.data.message.accessToken));
		})
		.catch(() => {
			console.error('Login failed');
		});
};

const refresh = async () => {
	if (!browser) return false;
	return API({
		method: 'post',
		url: 'auth/refresh',
		headers: { authorization: `Bearer ${refreshToken}` }
	})
		.then((res: APIResult) => {
			localStorage.setItem('accessToken', res.data.message.accessToken);
			localStorage.setItem('refreshToken', res.data.message.refreshToken);
			state.set(parseToken(res.data.message.accessToken));

			return true;
		})
		.catch(() => {
			logout();
			console.error('Login failed');
			return false;
		});
};

const isValidToken = (token: 'accessToken' | 'refreshToken') => {
	if (!browser) return false;
	const checkedToken = localStorage.getItem(token);
	if (checkedToken === null) return false;

	try {
		const decoded = z
			.object({
				id: z.string(),
				username: z.string().optional(),
				roles: z.string().array().optional(),
				perms: z.string().array().optional(),
				iat: z.number(),
				exp: z.number()
			})
			.parse(decode(checkedToken));

		if (decoded.exp > Date.now() / 1000) {
			return true;
		} else {
			return false;
		}
	} catch (e) {
		console.error(e);
	}
};

const isValidAccessToken = () => {
	return isValidToken('accessToken');
};

const isValidRefreshToken = () => {
	return isValidToken('refreshToken');
};

const hasPerm = (perm: string) => {
	if (!browser) return false;
	if (get(state)) {
		if (get(state)?.perms?.has('acl.bypass')) return true;
		return get(state)?.perms?.has(perm);
	}
	return false;
};

const isLoggedIn = () => {
	if (!browser) return false;
	console.log('Logged in?', get(state));
	return get(state) !== undefined;
};

// login(context: any, payload: { username: string; password: string }) {
//     return context
//       .dispatch('API', { method: 'post', url: 'auth/login', data: payload })
//       .then((res: AxiosResponse) => {
//         localStorage.setItem('accessToken', res.data.message.accessToken);
//         localStorage.setItem('refreshToken', res.data.message.refreshToken);
//         context.commit('setState', decode(res.data.message.accessToken) as AccessTokenPayload);
//         context.dispatch('addNotification', { type: 'sucess', message: 'Willkommen!' });
//         return Promise.resolve();
//       })
//       .catch(() => {
//         context.dispatch('addNotification', { type: 'error', message: 'Falscher Username oder Passwort' });
//         return Promise.reject();
//       });
//   },
//   refresh(context: any) {
//     if (context.getters.validToken('refreshToken')) {
//       return context
//         .dispatch('API', { method: 'post', url: 'auth/refresh', headers: { authorization: `Bearer ${localStorage.getItem('refreshToken')}` } })
//         .then((res: AxiosResponse) => {
//           localStorage.setItem('accessToken', res.data.message.accessToken);
//           localStorage.setItem('refreshToken', res.data.message.refreshToken);
//           context.commit('setState', decode(res.data.message.accessToken) as AccessTokenPayload);
//           clearTimeout(interval);
//           interval = setTimeout(() => context.dispatch('refresh'), 1000 * 60 * 2);
//         })
//         .catch(() => context.dispatch('logout'));
//     } else {
//       return context.dispatch('logout');
//     }
//   },

// validToken(state: any) {
//     return (token: 'refreshToken' | 'accessToken') => {
//       const checkedToken = localStorage.getItem(token);
//       if (checkedToken !== null) {
//         const tokenPayload = decode(checkedToken) as RefreshTokenPayload;
//         if (tokenPayload.exp > Date.now() / 1000) {
//           return true;
//         } else {
//           return false;
//         }
//       } else {
//         return false;
//       }
//     };
//   },
//   accountInfo(state: any) {
//     return state;
//   },

export const session = {
	token: {
		accessToken,
		refreshToken
	},
	state,
	action: {
		logout,
		login,
		refresh
	},
	isValidToken,
	hasPerm,
	isLoggedIn,
	isValidAccessToken,
	isValidRefreshToken
};
