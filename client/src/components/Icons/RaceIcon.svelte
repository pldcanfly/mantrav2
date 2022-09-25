<script lang="ts">
	import { raceTable } from '$store/tables';
	import type { Race } from 'src/app';

	export let race: Race;
	export let female: boolean = false;
	export let size: number = 45;
	export let click: any = () => undefined;

	let icon = female ? raceTable[race].icon.female : raceTable[race].icon.male;
</script>

<div
	class="raceicon icon"
	style:background-image="url({icon})"
	style:width="{size}px"
	style:height="{size}px"
	on:click={click}
/>

<style lang="scss">
	.raceicon {
		background-size: cover;
	}
</style>
