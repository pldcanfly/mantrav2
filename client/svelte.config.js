import adapter from '@sveltejs/adapter-auto';
import preprocess from 'svelte-preprocess';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://github.com/sveltejs/svelte-preprocess
	// for more information about preprocessors
	preprocess: preprocess(),

	kit: {
		alias: {
			$store: 'src/stores',
			$icons: 'src/lib/assets/icons',
			$components: 'src/components'
		},
		adapter: adapter(),
		trailingSlash: 'always'
	}
};

export default config;
