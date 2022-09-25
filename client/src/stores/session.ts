import decode from 'jwt-decode';
import { browser } from '$app/environment';
import { writable } from 'svelte/store';
import { z } from 'zod';
import { API, type APIResult } from '$lib/api';

interface SessionState {
	id: number;
	username: string;
	roles: Set<string>;
	perms: Set<string>;
	iat: number;
	exp: number;
}

export const isLoggedIn = writable(false);
export const accountid = writable(0);

const accessToken = browser ? localStorage.getItem('accessToken') : null;
const refreshToken = browser ? localStorage.getItem('refreshToken') : null;

const emptystate: SessionState = {
	id: 0,
	username: 'none',
	roles: new Set([]),
	perms: new Set([]),
	iat: 0,
	exp: 0
};

const parseToken = (token: string | null) => {
	if (token === null) return undefined;
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
		return emptystate;
	}
};

let state: SessionState = parseToken(accessToken) || emptystate;

export const logout = () => {
	if (!browser) return false;
	localStorage.removeItem('accessToken');
	localStorage.removeItem('refreshToken');
	state = emptystate;
	isLoggedIn.set(false);
	accountid.set(0);
};

export const login = async (username: string, password: string) => {
	if (!browser) return false;
	return API({ method: 'post', url: '/auth/login', data: { username, password } })
		.then((res: APIResult) => {
			console.log(res);
			localStorage.setItem('accessToken', res.data.message.accessToken);
			localStorage.setItem('refreshToken', res.data.message.refreshToken);
			state = parseToken(res.data.message.accessToken) || emptystate;
			isLoggedIn.set(true);
			accountid.set(state.id);

			console.log('login', parseToken(res.data.message.accessToken));
		})
		.catch(() => {
			console.error('Login failed');
			throw 'Username oder Passwort falsch';
			return;
		});
};

export const refresh = async () => {
	if (!browser) return false;

	return API({
		method: 'post',
		url: '/auth/refresh',
		headers: { authorization: `Bearer ${refreshToken}` }
	})
		.then((res: APIResult) => {
			localStorage.setItem('accessToken', res.data.message.accessToken);
			localStorage.setItem('refreshToken', res.data.message.refreshToken);
			state = parseToken(res.data.message.accessToken) || emptystate;

			return true;
		})
		.catch(() => {
			logout();

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
			isLoggedIn.set(true);
			accountid.set(parseInt(decoded.id));
			return true;
		} else {
			isLoggedIn.set(false);
			accountid.set(0);
			return false;
		}
	} catch (e) {
		console.error(e);
	}
};

export const isValidAccessToken = () => {
	return isValidToken('accessToken');
};

export const isValidRefreshToken = () => {
	return isValidToken('refreshToken');
};

export const hasPerm = (perm: string) => {
	if (!browser) return false;

	if (state.perms.has('acl.bypass')) return true;
	return state.perms.has(perm);
};
