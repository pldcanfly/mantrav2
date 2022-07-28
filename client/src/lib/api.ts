import axios, { type AxiosRequestConfig, type AxiosResponse } from 'axios';
import { session } from '$store/session';

const APIURL = import.meta.env.VITE_API_URL;

export interface APIRequest {
	method: string;
	url: string;
	data?: { [propName: string]: any };
	config?: AxiosRequestConfig;
	headers?: { [propName: string]: string | number };
	skipAuth?: boolean;
	progresshandler?: (progressEvent: ProgressEvent) => void;
}

export type APIResult = AxiosResponse & { data: { status: number; message: JSON } };

export async function API({
	method,
	url,
	data,
	config,
	headers,
	skipAuth,
	progresshandler
}: APIRequest) {
	const options: AxiosRequestConfig = {
		method,
		url: APIURL + url,
		data,
		headers: headers || {},
		...config
	};

	console.log(options);
	if (progresshandler) {
		options.onUploadProgress = (progressEvent: ProgressEvent) => {
			progresshandler(progressEvent);
		};
	}

	if (skipAuth) return axios(options);

	if (session.isValidAccessToken() && url != 'auth/refresh') {
		// ACCESS VALID AND NO AUTH URL
		if (options.headers)
			options.headers.authorization = `Bearer ${localStorage.getItem('accessToken')}`;
	} else if (session.isValidRefreshToken() && url != 'auth/refresh') {
		// ACCESS VALID AND NO AUTH URL
		const refresh = await session.action.refresh();
		if (!refresh) {
			// NOT EVEN REFRESH WORKED JUST LOG OUT
			session.action.logout();
		}
	}

	// Just try if it works anyway
	return axios(options);
}
