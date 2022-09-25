import axios, { type AxiosRequestConfig, type AxiosResponse } from 'axios';
import { isValidRefreshToken, refresh, logout, isValidAccessToken } from '$store/session';

const APIURL = import.meta.env.VITE_API_URL;

export interface APIRequest {
	method?: string;
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
		method: method || 'get',
		url: APIURL + url,
		data,
		headers: headers || {},
		...config
	};

	if (progresshandler) {
		options.onUploadProgress = (progressEvent: ProgressEvent) => {
			progresshandler(progressEvent);
		};
	}

	// AUTH skipped ... just go!
	if (skipAuth) return axios(options);

	if (isValidAccessToken() && url !== '/auth/refresh') {
		// ACCESS VALID AND NO AUTH URL
		if (options.headers)
			options.headers.authorization = `Bearer ${localStorage.getItem('accessToken')}`;
	} else if (isValidRefreshToken() && url !== '/auth/refresh') {
		// REFRESH VALID AND NO AUTH URL

		if (!(await refresh())) {
			// NOT EVEN REFRESH WORKED JUST LOG OUT
			logout();
		}
	}

	// Just try if it works anyway
	return axios(options);
}
