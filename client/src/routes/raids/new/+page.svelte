<script lang="ts">
	import RaidForm from '$components/site-elements/RaidForm.svelte';
	import type { iRaid } from 'src/app';

	let raid: iRaid = {
		name: '',
		date: new Date().toISOString(),
		description: '',
		icon: 'unknown',
		size: 25,
		signups: []
	};
</script>

<h1>Neuer Raid</h1>

<RaidForm {raid} />
