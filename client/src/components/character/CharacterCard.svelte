<script lang="ts">
	import { classTable, raceTable } from '$store/tables';

	import ClassIcon from '../Icons/ClassIcon.svelte';
	import RaceIcon from '../Icons/RaceIcon.svelte';
	import SpeccIcon from '../Icons/SpeccIcon.svelte';
	import RaceSelect from '$components/form/RaceSelect.svelte';
	import ClassSelect from '$components/form/ClassSelect.svelte';
	import SpeccSelect from '$components/form/SpeccSelect.svelte';
	import { API } from '$lib/api';
	import type { iCharacter } from 'src/app';
	import { addNotification } from '$store/notification';

	export let character: iCharacter;

	let edit = false;
	let del = false;
	let deltimeout;

	const toggleEdit = () => {
		edit = !edit;
	};

	const onSave = () => {
		edit = false;

		API({ url: `/characters/${character.id}`, method: 'post', data: { character } });
	};

	const onRaceSelect = () => {
		if (!raceTable[character.race].classes.includes(character.clazz)) {
			character.clazz = 'unknown';
			character.specc = 'unknown';
			if (character.offspecc) character.offspecc = undefined;
		}
	};

	const onClassSelect = () => {
		if (!classTable[character.clazz].speccs.includes(character.specc)) {
			character.specc = 'unknown';
			if (character.offspecc) character.offspecc = undefined;
		}
	};

	const confirmDel = () => {
		del = true;
		deltimeout = setTimeout(() => {
			del = false;
		}, 2000);
	};

	let nodeRef: any;
	const onDelete = () => {
		API({ url: `/characters/${character.id}`, method: 'delete' })
			.then(() => {
				addNotification('Charakter gelöscht', 'success');
				if (nodeRef) nodeRef.parentNode.removeChild(nodeRef);
			})
			.catch(() => {
				addNotification('Es ist etwas schief gelaufen', 'error');
			});
	};
</script>

<div class="charactercard" bind:this={nodeRef}>
	<div class="name">
		{#if edit}
			<input type="text" bind:value={character.name} />
		{:else}
			<span style:color={classTable[character.clazz].color}>
				{character.name}
			</span>
		{/if}
	</div>
	<div class="icongrid">
		<div class="race">
			{#if edit}
				{#key `${character.race}_${character.female.toString()}`}
					<RaceSelect
						bind:race={character.race}
						bind:female={character.female}
						on:select={onRaceSelect}
					/>
				{/key}
			{:else}
				<RaceIcon race={character.race} female={character.female} />
			{/if}
		</div>
		<div class="class">
			{#if edit}
				{#key character.clazz}
					<ClassSelect
						bind:clazz={character.clazz}
						race={character.race}
						on:select={onClassSelect}
					/>
				{/key}
			{:else}
				<ClassIcon clazz={character.clazz} />
			{/if}
		</div>
		<div class="specc">
			{#if edit}
				{#key `${character.specc}_${character.offspecc}`}
					<SpeccSelect
						bind:specc={character.specc}
						bind:offspecc={character.offspecc}
						clazz={character.clazz}
					/>
				{/key}
			{:else}
				<SpeccIcon specc={character.specc} offspecc={character.offspecc} />
			{/if}
		</div>
	</div>

	<div class="controls">
		{#if edit}
			{#if !del}
				<div class="button delete" on:click={confirmDel}>Löschen</div>
			{:else}
				<div class="button delete" on:click={onDelete}>Wirklich löschen?</div>
			{/if}

			<div class="button" on:click={onSave}>Speichern</div>
		{:else}
			<div class="button" on:click={toggleEdit}>Bearbeiten</div>
		{/if}
	</div>
</div>

<style lang="scss">
	@import '../../scss/global.scss';

	$padding: 10px;

	.charactercard {
		display: inline-block;
		width: 250px;
		background-color: var(--c__lighter_background);
		box-shadow: var(--c__shadow);

		.name {
			padding: $padding;
			font-size: 1.5rem;
			text-align: center;
		}

		.controls {
			display: flex;
			margin-top: 10px;

			.button {
				@include green-hoverable;
				flex-grow: 1;
				display: grid;
				justify-content: center;
				align-items: center;
				padding: 5px;

				&.delete {
					@include red-hoverable;
				}
			}
		}

		.icongrid {
			position: relative;
			padding: $padding;
			width: 100%;
			box-sizing: border-box;
			display: flex;
			flex-grow: 1fr;

			& > div {
				width: 33%;
				gap: 10px;
				display: grid;
				justify-items: center;
			}
		}
	}
</style>
