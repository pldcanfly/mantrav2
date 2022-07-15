<script lang="ts">
	import Footer from '$lib/components/site-elements/Footer.svelte';
	import Header from '$lib/components/site-elements/Header.svelte';
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
		}

		body.dark {
			--c__background: #222;
			--c__lighter_background: #363636;
			--c__text: #ebd2b6;
			--c__shadow: 0 0 15px rgba(0, 0, 0, 0.5);
			--c__shadow_inset: inset 0 0 0px rgba(0, 0, 0, 0.5);
			--c__link: #4c8551;
			--c__highlight: #444;
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

		input {
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
