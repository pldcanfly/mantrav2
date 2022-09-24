<script lang="ts">
	import Label from '$components/form/Label.svelte';
	import { API } from '$lib/api';
	import type { iUser } from 'src/app';

	export let data: { users: Array<iUser> };
	let { users } = data;

	const toggleUser = (user: iUser) => () => {
		user.open = user.open === undefined ? true : !user.open;
		users = users;
	};

	const onSave = (user: iUser) => () => {
		if (!user.id) {
			const { username, password } = user;
			API({ url: '/users', method: 'post', data: { username, password } }).then((res) => {
				user.id = res.data.message.id;
			});
		} else {
			const { username, password } = user;
			API({ url: `/users/${user.id}`, method: 'patch', data: { username, password } });
		}
		console.log(user);
	};

	const newUser = () => {
		users.push({
			username: 'newuser',
			password: 'iamapassword'
		});
		users = users;
	};
</script>

<h1>Userverwaltung</h1>
<div class="button newuser" on:click={newUser}>Neuen User anlegen</div>
<div class="users">
	{#each users as user}
		<div class="user">
			<div class="header" on:click={toggleUser(user)}>
				{user.username}
			</div>

			{#if user.open}
				<div class="form">
					<Label label="Username">
						<input bind:value={user.username} />
					</Label>
					<Label label="Passwort ">
						<input bind:value={user.password} />
					</Label>
					<div class="button" on:click={onSave(user)}>Speichern</div>
				</div>
			{/if}
		</div>
	{/each}
</div>

<style lang="scss">
	@import '../../../scss/global.scss';

	.users {
		display: grid;

		gap: 10px;
	}

	.user {
		box-shadow: var(--c__shadow);
		width: 100%;
		max-width: 400px;

		.header {
			padding: 15px;
			background-color: var(--c__lighter_background);
			cursor: pointer;
		}
	}

	.form {
		display: grid;
		gap: 10px;

		padding: 15px;
	}

	.button {
		display: grid;
		justify-content: center;
		align-items: center;
		padding: 10px;
		@include green-hoverable;
	}

	.newuser {
		width: 100%;
		max-width: 400px;

		margin-bottom: 20px;
	}
</style>
