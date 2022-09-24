<script lang="ts">
	import Footer from '$components/site-elements/Footer.svelte';
	import Header from '$components/site-elements/Header.svelte';

	import Notification from '$components/Notification.svelte';
</script>

<Header />
<Notification />

<div class="page">
	<slot />
</div>

<Footer />

<style lang="scss">
	@import '../scss/global.scss';

	$pagepadding: 20px;
	:global {
		html {
			font-size: 16px;
		}
		body {
			font-family: 'Roboto', sans-serif;

			--c__background: #eee;
			--c__text: #6002ee;
			--c_iconsize: 40px;

			--c__background: #222;
			--c__lighter_background: #363636;
			--c__text: #ebd2b6;
			--c__shadow: 0 0 15px rgba(0, 0, 0, 0.5);
			--c__shadow_inset: inset 0 0 0px rgba(0, 0, 0, 0.5);
			--c__link: #4c8551;
			--c__highlight: #444;

			--c__green: #3b683f;
			--c__dark-green: #2a492d;
			--c__light-green: #4c8551;

			--c__red: #944040;
			--c__dark-red: #632d2d;
			--c__light-red: #a44c4c;
		}

		body.ocean {
			--c__background: #0f111a;
			--c__lighter_background: #131621;
			--c__text: #abaeb1;
			--c__shadow: 0 0 15px rgba(0, 0, 0, 0.5);
			--c__shadow_inset: inset 0 0 0px rgba(0, 0, 0, 0.5);
			--c__link: #5e81ac;
			--c__highlight: #00403e;

			--c__green: #3b683f;
			--c__dark-green: #2a492d;
			--c__light-green: #4c8551;

			--c__red: #944040;
			--c__dark-red: #632d2d;
			--c__light-red: #a44c4c;
		}

		.noselect {
			-webkit-touch-callout: none;
			-webkit-user-select: none;
			-khtml-user-select: none;
			-moz-user-select: none;
			-ms-user-select: none;
			user-select: none;
		}

		body {
			background-color: var(--c__background);
			color: var(--c__text);

			padding: 0;
			margin: 0;
			height: 120vh;
			padding-top: 60px;
		}

		a {
			text-decoration: none;
			color: var(--c__link);
		}

		input,
		textarea {
			padding: 10px;
			background-color: var(--c__lighter_background);
			border: 1px solid var(--c__highlight);
			color: var(--c__text);
			outline: none;
		}

		h1 {
			background-color: var(--c__lighter_background);
			box-shadow: var(--c__shadow);
			margin-left: -$pagepadding;
			display: inline-block;
			padding: 10px;
			padding-left: $pagepadding;
			padding-right: $pagepadding;
		}

		@font-face {
			font-family: 'Roboto';
			font-style: normal;
			font-weight: 100;
			src: url('../lib/assets/fonts/Roboto-Thin.ttf') format('truetype');
		}
		@font-face {
			font-family: 'Roboto';
			font-style: italic;
			font-weight: 100;
			src: url('../lib/assets/fonts/Roboto-ThinItalic.ttf') format('truetype');
		}
		@font-face {
			font-family: 'Roboto';
			font-style: normal;
			font-weight: 300;
			src: url('../lib/assets/fonts/Roboto-Light.ttf') format('truetype');
		}
		@font-face {
			font-family: 'Roboto';
			font-style: italic;
			font-weight: 300;
			src: url('../lib/assets/fonts/Roboto-LightItalic.ttf') format('truetype');
		}
		@font-face {
			font-family: 'Roboto';
			font-style: normal;
			font-weight: 400;
			src: url('../lib/assets/fonts/Roboto-Regular.ttf') format('truetype');
		}
		@font-face {
			font-family: 'Roboto';
			font-style: italic;
			font-weight: 400;
			src: url('../lib/assets/fonts/Roboto-Italic.ttf') format('truetype');
		}

		@font-face {
			font-family: 'Roboto';
			font-style: italic;
			font-weight: 500;
			src: url('../lib/assets/fonts/Roboto-Medium.ttf') format('truetype');
		}
		@font-face {
			font-family: 'Roboto';
			font-style: normal;
			font-weight: 500;
			src: url('../lib/assets/fonts/Roboto-MediumItalic.ttf') format('truetype');
		}

		@font-face {
			font-family: 'Roboto';
			font-style: normal;
			font-weight: 700;
			src: url('../lib/assets/fonts/Roboto-Bold.ttf') format('truetype');
		}
		@font-face {
			font-family: 'Roboto';
			font-style: italic;
			font-weight: 700;
			src: url('../lib/assets/fonts/Roboto-BoldItalic.ttf') format('truetype');
		}
		@font-face {
			font-family: 'Roboto';
			font-style: normal;
			font-weight: 900;
			src: url('../lib/assets/fonts/Roboto-Black.ttf') format('truetype');
		}
		@font-face {
			font-family: 'Roboto';
			font-style: italic;
			font-weight: 900;
			src: url('../lib/assets/fonts/Roboto-BlackItalic.ttf') format('truetype');
		}
	}
	.page {
		padding: $pagepadding;
	}
</style>
