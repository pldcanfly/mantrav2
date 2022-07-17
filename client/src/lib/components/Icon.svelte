<script lang="ts">
	export let path: string = '';
	export let color: string = '#fff';
	export let width: string = '40px';
	export let height: string = width;
</script>

<svg style:width style:height viewBox="0 0 24 24">
	<path d={path} style:fill={color} />
</svg>

<style lang="scss">
	svg {
		display: inline;

		path {
			height: 100%;
			width: 100%;
		}
	}
</style>
