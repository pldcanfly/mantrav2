<script lang="ts">
	export let data;

	let raid: iRaid = data.raid;

	import SignupCharacter from '$components/character/SignupCharacter.svelte';
	import Dropable from '$components/Dropable.svelte';

	import Pickable from '$components/Pickable.svelte';

	import { format } from 'date-fns';
	import de from 'date-fns/locale/de/index';

	import { flip } from 'svelte/animate';
	import { crossfade, slide } from 'svelte/transition';
	const [send, receive] = crossfade({ duration: 200 });

	import type { iRaid, iSignup } from 'src/app';
	import { icons } from '$store/tables';
	import { hasPerm } from '$store/session';
	import { wssend, wson } from '$lib/websocket';
	import { API } from '$lib/api';

	$: unpositioned = raid.signups.filter(
		(signup) => signup.position == -1 && ['accepted', 'invited', 'declined'].includes(signup.state)
	);

	$: benched = raid.signups.filter((signup) => signup.position === -2);

	$: roster = raid.signups.filter((signup) => signup.position !== -1);

	const handleDrop = (
		position: number,
		state?: 'accepted' | 'invited' | 'declined',
		signup?: iSignup | undefined
	) => {
		return (dropped?: string) => {
			if (dropped) {
				const char = JSON.parse(dropped) as iSignup;
				const newsignup = raid.signups.find((signup) => signup.character.id == char.character.id);
				if (newsignup) {
					if (signup) {
						signup.position = newsignup.position;
					}
					newsignup.position = position;
					if (state) {
						newsignup.state = state;
					}
					raid = raid;

					updatestate(newsignup)();
				}
			}
		};
	};

	let showDropzones = false;

	const handleDragstart = () => {
		showDropzones = true;
	};
	const handleDragend = () => {
		showDropzones = false;
	};

	const socket = { name: 'raid', audience: raid.id?.toString() };

	const updatestate = (signup: iSignup) => async () => {
		await API({ url: `/signups/${raid.id}`, method: 'patch', data: signup });
		//wssend({ ...socket, event: 'updatestate', message: JSON.stringify(signup) });
	};

	wson({
		...socket,
		event: 'updateraid',
		handler: (message: any) => {
			raid = message;
		}
	});

	wson({
		...socket,
		event: 'updatestate',
		handler: (message: any) => {
			for (const index in raid.signups) {
				if (raid.signups[index].character.id === message.character.id) {
					raid.signups[index] = message;
					break;
				}
			}
		}
	});
</script>

<h1>{raid.name}</h1>

{#if hasPerm('raidmanagement')}
	<a href="/raids/{raid.id}/edit">Raid bearbeiten</a>
{/if}

<div class="header">
	<div class="icon" style:background-image="url({icons.get(raid.icon)})" />
	<div class="text">
		{format(new Date(raid.date), 'd. MMMM, yyyy - HH:mm ', { locale: de })}<br />
		{raid.description}
	</div>
</div>

<div class="raidgrid">
	<div class="row">
		<h2>Einladungen</h2>

		<div class="unpositioned">
			{#each unpositioned as signup (signup.character.id)}
				<div
					class="animcontainer"
					animate:flip={{ duration: 200 }}
					in:receive={{ key: signup.character.id }}
					out:send={{ key: signup.character.id }}
				>
					<Pickable
						draggable={hasPerm('raidmanagement')}
						data={JSON.stringify(signup)}
						on:dragstart={handleDragstart}
						on:dragend={handleDragend}
					>
						<SignupCharacter {signup} on:changed={updatestate(signup)} />
					</Pickable>
				</div>
			{:else}
				{#if !showDropzones}
					<div class="empty" style:grid-column="1 / span 2">Keine Anmeldungen mehr vorhanden</div>
				{/if}
			{/each}
		</div>
		{#if showDropzones}
			<div class="dropzone" transition:slide={{ duration: 100 }}>
				<Dropable onDrop={handleDrop(-1)}>Verschieben</Dropable>
			</div>
		{/if}
	</div>
	<div class="row">
		<h2>Ersatzbank</h2>

		<div class="benched">
			{#each benched as signup (signup.character.id)}
				<div
					class="animcontainer"
					animate:flip={{ duration: 200 }}
					in:receive={{ key: signup.character.id }}
					out:send={{ key: signup.character.id }}
				>
					<Pickable
						draggable={hasPerm('raidmanagement')}
						data={JSON.stringify(signup)}
						on:dragstart={handleDragstart}
						on:dragend={handleDragend}
					>
						<SignupCharacter {signup} on:changed={updatestate(signup)} />
					</Pickable>
				</div>
			{:else}
				{#if !showDropzones}
					<div class="empty">Leere Ersatzbank</div>
				{/if}
			{/each}
		</div>

		{#if showDropzones}
			<div class="dropzone" transition:slide={{ duration: 100 }}>
				<Dropable onDrop={handleDrop(-2)}>Verschieben</Dropable>
			</div>
		{/if}
	</div>
	<!-- <div class="row"><h2>Raidbuffs - NYI</h2></div> -->
	<div class="row">
		<h2>Roster</h2>
		<div class="rostergrid">
			{#each Array(Math.ceil(raid.size / 5)) as _, group}
				{@const size = 5}
				<div class="group">
					<div class="group-heading">
						Gruppe {group + 1}
					</div>

					{#each Array(size) as _, pos}
						{@const relativepos = group * size + pos}
						{@const signup = roster.find((signup) => signup.position == relativepos)}

						<Dropable onDrop={handleDrop(relativepos, signup?.state, signup)}>
							{#if signup}
								{#key signup.character.id}
									<div
										class="animcontainer"
										in:receive={{ key: signup.character.id }}
										out:send={{ key: signup.character.id }}
									>
										<Pickable
											draggable={hasPerm('raidmanagement')}
											data={JSON.stringify(signup)}
											on:dragstart={handleDragstart}
											on:dragend={handleDragend}
										>
											<SignupCharacter {signup} on:changed={updatestate(signup)} />
										</Pickable>
									</div>
								{/key}
							{:else}
								<div class="pos dropable">Frei</div>
							{/if}
						</Dropable>
					{/each}
				</div>
			{/each}
		</div>
	</div>
</div>

<style lang="scss">
	h2 {
		text-align: center;
	}

	.empty {
		text-align: center;
	}

	.animcontainer {
		width: 100%;
	}

	.dropzone {
		margin-bottom: 50px;
	}

	:global {
		.dropzone {
			.dropable {
				width: 100%;
				height: 50px;
				justify-content: center;
				align-items: center;
			}
		}
	}

	.unpositioned {
		display: grid;
		grid-template-columns: 1fr;
		gap: 10px;

		@media screen and (min-width: 1000px) {
			grid-template-columns: 1fr 1fr;
		}
	}

	.benched {
		display: grid;
		grid-template-columns: 1fr;
		gap: 10px;
	}

	// .legend {
	// 	display: grid;
	// 	grid-template-columns: 1fr 1fr 1fr;
	// 	margin-top: 20px;
	// 	div {
	// 		display: grid;
	// 		grid-template-columns: 30px 1fr;
	// 		align-items: center;
	// 		gap: 10px;
	// 	}
	// }

	.header {
		display: flex;
		gap: 25px;
		margin-bottom: 40px;
		.icon {
			height: 150px;
			width: 150px;
			box-shadow: var(--c__shadow);
			background-size: cover;
		}
	}

	.raidgrid {
		min-height: 150px;
		display: grid;
		grid-template-columns: 1fr;
		gap: 30px;

		@media screen and (min-width: 1000px) {
			grid-template-columns: 3fr 1.5fr 3fr;
		}
		// .row {
		// 	border: 1px solid green;
		// }
	}

	.rostergrid {
		display: grid;

		grid-template-columns: 1fr;
		@media screen and (min-width: 1200px) {
			grid-template-columns: 1fr 1fr;
		}

		gap: 25px;
		.group {
			padding: 10px;
			box-shadow: var(--c__shadow);
			background-color: var(--c__lighter_background);
			.group-heading {
				text-align: center;
				background-color: var(--c__highlight);
				margin: -10px;
				padding: 5px;
				margin-bottom: 10px;
				box-shadow: var(--c__shadow);
			}
		}

		.pos {
			color: var(--c__green);
			height: 30px;
			display: grid;
			justify-content: center;
			align-items: center;
		}
	}
</style>
