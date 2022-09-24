<script lang="ts">
	import Label from '$components/form/Label.svelte';
	import IconSelect from '$components/form/IconSelect.svelte';
	import { DateInput } from 'date-picker-svelte';
	import Character from '$components/character/Character.svelte';

	import type { iCharacter, iGroup, iRaid } from 'src/app';
	import { API } from '$lib/api';

	let groups: Array<iGroup> = [];
	let members: Array<iCharacter> = [];

	(async function () {
		groups = (await API({ url: '/groups' })).data.message as Array<iGroup>;
	})();

	(async function () {
		members = (await API({ url: '/characters' })).data.message as Array<iCharacter>;
	})();

	export let raid: iRaid;

	let date = new Date();

	let invited: Map<number, iCharacter> = new Map();
	for (const signup of raid.signups) {
		invited.set(signup.character.id, signup.character);
	}

	const invite = (character: iCharacter) => {
		return () => {
			if (invited.has(character.id)) {
				invited.delete(character.id);
			} else {
				invited.set(character.id, character);
			}
			invited = invited;
		};
	};

	const inviteGroup = (members: Array<iCharacter>) => {
		return () => {
			for (const member of members) {
				console.log(member);
				invite(member)();
			}
		};
	};

	const saveRaid = async () => {
		const data = raid;
		data.signups = [];
		for (const [_, member] of invited) {
			data.signups = [
				...data.signups,
				{
					position: -1,
					state: 'invited',
					character: member
				}
			];
		}

		data.date = date.toISOString();
		data.size = parseInt(data.size.toString());
		console.log(data);

		await API({ url: '/raids', method: 'post', data });
	};
</script>

<h2>Raidinformationen</h2>
{raid.id}
{raid.icon}

<div class="raidform">
	<IconSelect bind:icon={raid.icon} />
	<Label label="Name"><input type="text" bind:value={raid.name} /></Label>
	<Label label="Beschreibung" labelontop><textarea bind:value={raid.description} /></Label>
	<Label label="Größe"><input type="number" bind:value={raid.size} max="40" min="1" /></Label>
	<Label label="Startzeitpunkt"><DateInput bind:value={date} /></Label>
	<button class="button" on:click={saveRaid}>Speichern</button>
</div>

<h2>Einladungen</h2>
<div class="groups">
	{#each groups as group}
		<div class="group" on:click={inviteGroup(group.members)}>{group.name}</div>
	{:else}
		Lade Gruppen...
	{/each}
</div>

<div class="members">
	{#each members as character}
		<div class="member" class:selected={invited.has(character.id)} on:click={invite(character)}>
			<Character {character} />
		</div>
	{:else}
		Keine Charaktere gefunden
	{/each}
</div>

<style lang="scss">
	@import '../../scss/global.scss';

	.raidform {
		display: grid;
		gap: 10px;

		--date-picker-foreground: var(--c__text);
		--date-picker-background: var(--c__lighter_background);
		--date-picker-highlight-border: var(--c__light-green);

		--date-picker-selected-background: var(--c__green);

		button {
			@include green-hoverable;
			border: 0;
			padding: 15px;
			color: var(--c__text);
		}
	}

	.groups {
		display: flex;
		gap: 10px;
		.group {
			@include green-hoverable;
			border: 0;
			padding: 15px;
			color: var(--c__text);
		}
	}

	.member {
		&.selected {
			:global(.character) {
				transition: all 0.2s ease;
				background-color: var(--c__dark-green);
				box-shadow: none;
			}
		}
		cursor: pointer;
	}

	.members {
		margin-top: 30px;
		display: flex;
		gap: 15px;
		flex-wrap: wrap;
	}
</style>
