<script lang="ts">
	import { addNotification } from '$store/notification';

	import { session } from '$store/session';

	let loggedin = false;

	let username = '';
	let password = '';
	let showLogin = false;

	session.state.subscribe(() => {
		loggedin = session.isLoggedIn();
	});

	const login = async () => {
		try {
			await session.action.login(username, password);
			addNotification(`Willkommen ${username}!`, 'success', 5000);
			showLogin = false;
		} catch (err) {
			addNotification('Falscher Username oder Passwort', 'error', 5000);
		}
	};

	const logout = async () => {
		session.action.logout();
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
		{#if !loggedin}
			<div class="nav-item" on:click={() => (showLogin = !showLogin)}>Login</div>
		{:else}
			<div class="nav-item" on:click={logout}>Logout</div>
		{/if}
	</div>
</nav>
{#if showLogin}
	<div class="loginframe">
		<span>Username</span><input type="text" bind:value={username} />
		<span>Passwort</span><input type="password" bind:value={password} />
		<div class="button" on:click={login}>Einloggen</div>
	</div>
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
		grid-template-columns: 90px 1fr;
		justify-content: center;
		align-items: center;
		gap: 10px 0px;

		span {
			display: grid;
			justify-items: center;
			align-items: center;
			padding: 9px;

			background-color: var(--c__lighter_background);
		}

		.button {
			grid-column: 1 / span 2;

			@include green-hoverable;
			display: grid;
			justify-content: center;
			align-items: center;
			height: 40px;
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
