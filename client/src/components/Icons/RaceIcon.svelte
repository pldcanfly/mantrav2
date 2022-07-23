<script lang="ts">
	import { raceTable } from '$store/tables';

	export let race: Race;
	export let female: boolean = false;
	export let size: number = 45;

	let icon = female ? raceTable[race].icon.female : raceTable[race].icon.male;
</script>

<div
	class="raceicon icon"
	style:background-image="url({icon})"
	style:width="{size}px"
	style:height="{size}px"
/>

<style lang="scss">
	.raceicon {
		background-size: cover;
	}
</style>
