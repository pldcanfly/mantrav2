<script lang="ts">
	import RaidForm from '$components/site-elements/RaidForm.svelte';
	import type { iRaid } from 'src/app';

	export let data;
	const { raid } = data;
</script>

<h1>Raid bearbeiten: {raid.name}</h1>

<RaidForm {raid} />
