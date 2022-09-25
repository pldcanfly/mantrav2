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

	import { scale } from 'svelte/transition';
	import { createEventDispatcher } from 'svelte';

	export let character: iCharacter;

	export let edit = false;
	let del = false;
	let deltimeout;

	const dispatch = createEventDispatcher();

	const toggleEdit = () => {
		edit = !edit;
	};

	const onSave = () => {
		edit = false;

		API({ url: `/characters/${character.id}`, method: 'post', data: { character } }).then((res) => {
			console.log(res);
		});
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

	const onDelete = () => {
		API({ url: `/characters/${character.id}`, method: 'delete' })
			.then(() => {
				addNotification('Charakter gelöscht', 'success');
				dispatch('deleted');
			})
			.catch(() => {
				addNotification('Es ist etwas schief gelaufen', 'error');
			});
	};
</script>

<div class="charactercard" class:edit>
	<div class="name">
		<span style:color={classTable[character.clazz].color}>
			{character.name}
		</span>
	</div>
	<div class="icongrid">
		<div class="race">
			{#key `${character.race}_${character.female.toString()}`}
				<RaceIcon race={character.race} female={character.female} />
			{/key}
		</div>
		<div class="class">
			{#key `${character.clazz}}`}
				<ClassIcon clazz={character.clazz} />
			{/key}
		</div>
		<div class="specc">
			{#key `${character.specc}}`}
				<SpeccIcon specc={character.specc} offspecc={character.offspecc} />
			{/key}
		</div>
	</div>

	<div class="controls">
		<div class="button" on:click={toggleEdit}>Bearbeiten</div>
	</div>
	{#if edit}
		<div class="form" transition:scale={{ duration: 200 }}>
			<div class="name">
				<input type="text" bind:value={character.name} />
			</div>

			<div class="selects">
				<div class="select">
					<div class="label">Rasse</div>
					<div class="icon">
						{#key `${character.race}_${character.female.toString()}`}
							<RaceSelect
								bind:race={character.race}
								bind:female={character.female}
								on:select={onRaceSelect}
							/>
						{/key}
					</div>
				</div>
				<div class="select">
					<div class="label">Klasse</div>
					<div class="icon">
						{#key `${character.clazz}`}
							<ClassSelect
								bind:clazz={character.clazz}
								race={character.race}
								on:select={onClassSelect}
							/>
						{/key}
					</div>
				</div>
				<div class="select">
					<div class="label">Specc</div>
					<div class="icon">
						{#key `${character.specc}}`}
							<SpeccSelect bind:specc={character.specc} clazz={character.clazz} />
						{/key}
					</div>
				</div>
				<div class="select">
					<div class="label">Offspecc</div>
					<div class="icon">
						{#key `${character.offspecc}}`}
							<SpeccSelect bind:specc={character.offspecc} clazz={character.clazz} empty />
						{/key}
					</div>
				</div>
			</div>

			<div class="controls">
				{#if !del}
					<div class="button delete" on:click={confirmDel}>Löschen</div>
				{:else}
					<div class="button delete" on:click={onDelete}>Wirklich löschen?</div>
				{/if}

				<div class="button" on:click={onSave}>Speichern</div>
			</div>
		</div>
	{/if}
</div>

<style lang="scss">
	@import '../../scss/global.scss';

	$padding: 10px;

	.charactercard {
		display: inline-block;
		width: 100%;
		max-width: 300px;
		background-color: var(--c__lighter_background);
		box-shadow: var(--c__shadow);
		transition: 0.2s all;
		position: relative;

		.name {
			padding: $padding;
			font-size: 1.5rem;
			text-align: center;
		}

		.controls {
			display: flex;
			margin-top: 10px;
			flex-wrap: wrap;

			.button {
				@include green-hoverable;
				//flex-grow: ;
				width: 100%;
				display: grid;
				justify-content: center;
				align-items: center;
				padding: 10px;

				&.delete {
					@include red-hoverable;
				}
			}
		}

		.form {
			background-color: var(--c__lighter_background);

			position: absolute;
			top: -5px;
			left: -5px;
			right: -5px;

			box-shadow: var(--c__shadow);
			display: grid;
			gap: 5px;

			grid-template-rows: 60px 1fr;

			padding-bottom: 80px;
			.name {
				padding: 10px;
			}

			.controls {
				position: absolute;
				bottom: 0;
				width: 100%;
			}

			.selects {
				padding: 15px;
				display: grid;

				grid-template-columns: 1fr 1fr;
				gap: 10px;
			}

			.select {
				width: 50%;
				display: flex;
				gap: 15px;
				align-items: center;
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
