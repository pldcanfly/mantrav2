<script lang="ts">
	import Footer from '$components/site-elements/Footer.svelte';
	import Header from '$components/site-elements/Header.svelte';
</script>

<Header />

<div class="page">
	<slot />
</div>

<Footer />

<style lang="scss">
	$pagepadding: 20px;
	:global {
		body {
			--c__background: #eee;
			--c__text: #6002ee;
			--c_iconsize: 40px;
		}

		body.dark {
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
	}
	.page {
		padding: $pagepadding;
	}
</style>
