<script lang="ts">
	import Label from '$components/form/Label.svelte';

	import { addNotification } from '$store/notification';

	import { hasPerm, isLoggedIn, login, logout } from '$store/session';

	let username = '';
	let password = '';
	let showLogin = false;

	const onLogin = async () => {
		try {
			await login(username, password);
			addNotification(`Willkommen ${username}!`, 'success', 5000);
			showLogin = false;
		} catch (err) {
			addNotification('Falscher Username oder Passwort', 'error', 5000);
		}
	};

	const onLogout = async () => {
		await logout();
	};
</script>

<nav>
	<div class="left">
		Mantra Raidplaner
		<div class="nav-container">
			<a href="/raids/" class="nav-item"><span>Raids</span></a>
			<a href="/roster/" class="nav-item"><span>Roster</span></a>
			<a href="/links/" class="nav-item"><span>Links</span></a>
		</div>
	</div>
	<div class="right">
		{#if !$isLoggedIn}
			<div class="nav-item" on:click={() => (showLogin = !showLogin)}>Login</div>
		{:else}
			{#if hasPerm('usermanagment')}
				<a href="/management/users" class="nav-item"><span>Userverwaltung</span></a>
			{/if}
			{#if hasPerm('groupmanagment')}
				<a href="/management/groups" class="nav-item"><span>Gruppenverwaltung</span></a>
			{/if}
			<a href="/profile/" class="nav-item"><span>Mein Profil</span></a>
			<div class="nav-item" on:click={onLogout}>Logout</div>
		{/if}
	</div>
</nav>
{#if showLogin}
	<form action="javascript:void(0);" on:submit={onLogin}>
		<div class="loginframe">
			<Label label="Username" width="90px"><input type="text" bind:value={username} /></Label>
			<Label label="Passwort" width="90px"><input type="password" bind:value={password} /></Label>

			<button class="button" type="submit">Einloggen</button>
		</div>
	</form>
{/if}

<style lang="scss">
	@import '../../scss/global.scss';

	.loginframe {
		position: fixed;
		right: 10px;
		top: 60px;
		display: inline-block;
		background-color: var(--c__highlight);
		padding: 10px;
		box-shadow: var(--c_shadow);
		display: grid;
		grid-template-rows: 1fr 1fr 40px;
		grid-template-columns: 1fr;
		justify-content: center;
		align-items: center;
		gap: 10px 0px;

		// span {
		// 	display: grid;
		// 	justify-items: center;
		// 	align-items: center;
		// 	padding: 9px;

		// 	background-color: var(--c__lighter_background);
		// }

		.button {
			@include green-hoverable;
			display: grid;
			justify-content: center;
			align-items: center;
			height: 40px;
			border: none;
			color: var(--c__text);
		}
	}
	nav {
		padding: 0;
		min-height: 50px;
		z-index: 99;
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;

		background-color: var(--c__lighter_background);
		box-shadow: var(--c__shadow);
		display: flex;
		align-items: stretch;
		//border: 1px solid green;

		.left,
		.right {
			display: flex;
			//border: 1px solid pink;
			align-items: center;
			padding: 0px;
			padding-left: 10px;
			padding-right: 10px;
			width: 50%;
		}

		.right {
			justify-content: end;
		}

		.nav-container {
			padding-left: 10px;
			padding-right: 10px;
			display: flex;
			//border: solid 1px blue;
			height: 100%;
			align-items: stretch;
			justify-items: center;
		}
		.nav-item {
			cursor: pointer;
			text-decoration: none;
			color: var(--c__link);
			margin-left: 5px;
			margin-right: 5px;
			padding-left: 10px;
			padding-right: 10px;
			height: 100%;
			display: flex;
			align-items: center;
			justify-items: center;

			transition: box-shadow 0.2s linear;

			&:hover {
				//background-color: var(--c__background);
				box-shadow: var(--c__shadow);
			}
		}
	}
</style>
