import { sveltekit } from '@sveltejs/kit/vite';

/** @type {import('vite').UserConfig} */
const config = {
	alias: {
		$store: 'src/stores'
	},
	plugins: [sveltekit()]
};

export default config;
