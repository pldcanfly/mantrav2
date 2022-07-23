<script lang="ts">
	import SignupCharacter from '$components/character/SignupCharacter.svelte';
	import { mdiCheck, mdiHelp, mdiClose, mdiPencil, mdiSignatureImage } from '@mdi/js';
	import { format } from 'date-fns';
	import de from 'date-fns/locale/de/index.js';

	import Dropable from '$components/Dropable.svelte';
	import Icon from '$components/Icon.svelte';
	import Pickable from '$components/Pickable.svelte';

	import { iconTable } from '$store/tables';

	import type { iRaid, iSignup } from './[raidid]';

	export let raid: iRaid;
	$: unpositioned = raid.signups.filter(
		(signup) => signup.position == -1 && ['accepted', 'invited', 'declined'].includes(signup.state)
	);

	$: benched = raid.signups.filter((signup) => signup.position == -2);

	$: roster = raid.signups.filter((signup) => signup.position != -1);

	const handleDrop = (position: number) => {
		return (dropped?: string) => {
			if (dropped) {
				const char = JSON.parse(dropped) as iSignup;

				//console.log(char, { test: 123 });
				const signup = raid.signups.find((signup) => signup.character.id == char.character.id);
				if (signup) {
					console.log('Drop!!', signup, position);
					signup.position = position;
					raid = raid;
				}
			}
		};
	};
</script>

<h1>Raid {raid.name}</h1>

<div class="header">
	<div class="icon" style:background-image="url({iconTable[raid.icon]})" />
	<div class="text">
		{format(new Date(raid.date), 'd. MMMM, yyyy - HH:mm ', { locale: de })}<br />
		{raid.description}
	</div>
</div>

<div class="raidgrid">
	<div class="row">
		<h2>Anmeldungen</h2>

		<!-- <Dropable onDrop={(val) => console.log('dropped', val)}> -->
		<div class="unpositioned">
			{#each unpositioned as signup}
				{#key signup.character.id}
					<Pickable data={JSON.stringify(signup)}>
						<SignupCharacter {signup} />
					</Pickable>
				{/key}
			{/each}
		</div>
		<div class="legend">
			<div><Icon path={mdiHelp} width={'30px'} /> Eingeladen</div>
			<div><Icon path={mdiCheck} width={'30px'} /> Angenommen</div>
			<div><Icon path={mdiClose} width={'30px'} /> Abgelehnt</div>
		</div>

		<!-- </Dropable> -->
	</div>
	<div class="row">
		<h2>Ersatzbank</h2>
		{#each benched as signup}
			{#key signup.character.id}
				<Pickable data={JSON.stringify(signup)}>
					<SignupCharacter {signup} />
				</Pickable>
			{/key}
		{:else}
			Leere Ersatzbank
		{/each}
	</div>
	<div class="row"><h2>Raidbuffs - NYI</h2></div>
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

						<Dropable onDrop={handleDrop(relativepos)}>
							{#if signup}
								{#key signup.character.id}
									<Pickable data={JSON.stringify(signup)}>
										<SignupCharacter {signup} />
									</Pickable>
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
	.unpositioned {
		display: grid;
		grid-template-columns: 1fr;
		gap: 10px;

		@media screen and (min-width: 1000px) {
			grid-template-columns: 1fr 1fr;
		}
	}

	.legend {
		display: grid;
		grid-template-columns: 1fr 1fr 1fr;
		margin-top: 20px;
		div {
			display: grid;
			grid-template-columns: 30px 1fr;
			align-items: center;
			gap: 10px;
		}
	}

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
			grid-template-columns: 3fr 1.5fr 1fr 3fr;
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
			height: 40px;
			display: grid;
			justify-content: center;
			align-items: center;
		}
	}
</style>
