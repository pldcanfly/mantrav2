<script lang="ts">
	import { classTable } from '$store/tables';

	export let size: number = 45;
	export let clazz: Clazz;
</script>

<div
	class="classicon icon"
	style:background-image="url({classTable[clazz].icon})"
	style:width="{size}px"
	style:height="{size}px"
/>

<style lang="scss">
	.classicon {
		background-size: cover;
	}
</style>
