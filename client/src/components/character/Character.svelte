<script lang="ts">
	import ClassIcon from '../Icons/ClassIcon.svelte';
	import RaceIcon from '../Icons/RaceIcon.svelte';
	import SpeccIcon from '../Icons/SpeccIcon.svelte';

	import { classTable } from '$store/tables';
	import type { iCharacter } from 'src/app';

	export let character: iCharacter;
</script>

<div class="character">
	<div class="name">
		<span style:color={classTable[character.clazz].color}>
			{character.name}
		</span>
	</div>
	<div class="race">
		<RaceIcon race={character.race} female={character.female} />
	</div>
	<div class="class">
		<ClassIcon clazz={character.clazz} />
	</div>
	<div class="specc">
		<SpeccIcon specc={character.specc} offspecc={character.offspecc} />
	</div>
</div>

<style lang="scss">
	.character {
		box-sizing: border-box;
		background-color: var(--c__lighter_background);

		width: 250px;
		display: inline-grid;
		align-items: center;

		grid-template-columns: 1fr 45px 45px 45px;

		box-shadow: var(--c__shadow);

		.name {
			padding: 10px;
		}
	}
</style>
