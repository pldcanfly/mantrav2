<script lang="ts">
	export let data;
	import Character from '$components/character/Character.svelte';
	import CharacterCard from '$components/character/CharacterCard.svelte';
	import Label from '$components/form/Label.svelte';
	import Icon from '$components/Icon.svelte';
	import { API } from '$lib/api';
	import { addNotification } from '$store/notification';

	import { accountid } from '$store/session';
	import { mdiPlus } from '@mdi/js';
	import type { iCharacter } from 'src/app';
	let password1 = '';
	let password2 = '';

	let characters: Map<string, iCharacter> = new Map();

	const reloadUsers = async () => {
		const newchars = (await API({ url: '/characters/mine' })).data.message as Array<iCharacter>;
		characters = new Map();
		for (const char of newchars) {
			characters.set(char.id, char);
		}
	};

	reloadUsers();

	const addCharacter = () => {
		if ($accountid !== 0) {
			characters.set(`${characters.size * -1}`, {
				id: `${characters.size * -1}`,
				name: 'INeedAName',
				race: 'unknown',
				clazz: 'unknown',
				specc: 'unknown',
				female: false,
				accountid: $accountid.toString()
			});
			characters = characters;
		}
	};

	const changePassword = () => {
		if (password1 == '') {
			addNotification('Passwort darf nicht leer sein', 'error');
			return;
		}

		if (password1 != password2) {
			addNotification('Passwörter stimmen nicht überein', 'error');
			return;
		}

		API({ url: '/users', method: 'patch', data: { password: password1 } })
			.then(() => {
				addNotification('Passwort geändert', 'success');
			})
			.catch(() => {
				addNotification('Es ist etwas schief gelaufen', 'error');
			});
	};
</script>

<h1>Mein Profil</h1>

<h2>Passwort ändern</h2>

<div class="changepassword">
	<Label label="Passwort" width="200px">
		<input bind:value={password1} type="password" />
	</Label>
	<Label label="Passwort wiederholen" width="200px">
		<input bind:value={password2} type="password" />
	</Label>
	<div class="button" on:click={changePassword}>Speichern</div>
</div>

<h2>Charaktere</h2>

<div class="characters">
	{#each [...characters.entries()] as [_, character]}
		<CharacterCard {character} edit={parseInt(character.id) < 0} on:deleted={reloadUsers} />
	{/each}

	<div class="newcharacter" on:click={addCharacter}>
		<Icon path={mdiPlus} width={'25px'} />
	</div>
</div>

<style lang="scss">
	@import '../../scss/global.scss';

	.changepassword {
		display: grid;
		gap: 10px;

		:global(.labeled-input),
		.button {
			max-width: 600px;
			width: 100%;
		}

		.button {
			@include green-hoverable;
			padding-top: 15px;
			padding-bottom: 15px;
			display: grid;
			justify-content: center;
			justify-items: center;
		}
	}
	.characters {
		display: flex;
		gap: 15px;
	}

	.newcharacter {
		cursor: pointer;
		width: 250px;
		background-color: var(--c__lighter_background);
		box-shadow: var(--c__shadow);
		display: grid;
		justify-items: center;
		align-items: center;
		transition: all 0.2s linear;

		&:hover {
			background-color: var(--c__green);
		}
	}
</style>
