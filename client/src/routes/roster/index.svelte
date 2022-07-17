<script lang="ts">
	import type { Roster } from '.';

	export let roster: Roster;
	import Character from '$lib/components/character/Character.svelte';

	const namesort = (a: iCharacter, b: iCharacter) => {
		if (a.name > b.name) return 1;
		if (a.name < b.name) return -1;
		return 0;
	};
</script>

<h1>Roster</h1>

<h2>Tanks</h2>
<div class="character-grid">
	{#each roster['tank'].sort(namesort) as character}
		<Character {character} />
	{:else}
		Keine Charaktere gefunden
	{/each}
</div>

<h2>Melee</h2>
<div class="character-grid">
	{#each roster['melee'].sort(namesort) as character}
		<Character {character} />
	{:else}
		Keine Charaktere gefunden
	{/each}
</div>

<h2>Ranged</h2>
<div class="character-grid">
	{#each roster['ranged'].sort(namesort) as character}
		<Character {character} />
	{:else}
		Keine Charaktere gefunden
	{/each}
</div>

<h2>Heals</h2>
<div class="character-grid">
	{#each roster['heal'].sort(namesort) as character}
		<Character {character} />
	{:else}
		Keine Charaktere gefunden
	{/each}
</div>

<style lang="scss">
	.character-grid {
		display: flex;
		gap: 15px;
		flex-wrap: wrap;
	}
</style>
