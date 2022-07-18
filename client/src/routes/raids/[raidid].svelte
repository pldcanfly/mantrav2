<script lang="ts">
	import SignupCharacter from '$lib/components/character/SignupCharacter.svelte';
	import { mdiCheck, mdiHelp, mdiClose, mdiPencil } from '@mdi/js';
	import { format } from 'date-fns';
	import de from 'date-fns/locale/de/index.js';

	import Dropable from '$lib/components/Dropable.svelte';
	import Icon from '$lib/components/Icon.svelte';
	import Pickable from '$lib/components/Pickable.svelte';

	import { iconTable } from '$store/tables';

	import type { iRaid, iSignup } from './[raidid]';

	export let raid: iRaid;
	$: unpositioned = raid.signups.filter(
		(signup) => signup.position == -1 && ['accepted', 'invited', 'declined'].includes(signup.state)
	);

	$: benched = raid.signups.filter(
		(signup) => signup.position == -1 && ['benched'].includes(signup.state)
	);

	$: roster = raid.signups.filter((signup) => signup.position != -1);

	const handleDrop = (position: number) => {
		return (dropped: string) => {
			const char = JSON.parse(dropped) as iSignup;

			//console.log(char, { test: 123 });
			const signup = raid.signups.find((signup) => signup.character.id == char.character.id);
			if (signup) {
				console.log('Drop!!', signup, position);
				signup.position = position;
				raid = raid;
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
		<div class="legend">
			<div><Icon path={mdiHelp} width={'30px'} /> Eingeladen</div>
			<div><Icon path={mdiCheck} width={'30px'} /> Angenommen</div>
			<div><Icon path={mdiClose} width={'30px'} /> Abgelehnt</div>
		</div>
		<!-- <Dropable onDrop={(val) => console.log('dropped', val)}> -->
		<div class="unpositioned">
			{#each unpositioned as signup}
				<Pickable data={JSON.stringify(signup)}>
					<SignupCharacter {signup} />
				</Pickable>
			{/each}
		</div>

		<!-- </Dropable> -->
	</div>
	<div class="row">
		{#each benched as signup}
			<Pickable data={JSON.stringify(signup)}>
				<SignupCharacter {signup} />
			</Pickable>
		{/each}
	</div>
	<div class="row">Raidbuffs - NYI</div>
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
							<SignupCharacter {signup} />
						{:else}
							<div class="pos dropable">Frei</div>
						{/if}
					</Dropable>
				{/each}
			</div>
		{/each}
	</div>
</div>

<style lang="scss">
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
		margin-bottom: 20px;
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
		gap: 15px;

		@media screen and (min-width: 1000px) {
			grid-template-columns: 2fr 1fr 1fr 2fr;
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
	}

	.dropable {
		box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.5);
		background-color: var(--c__background);
		border: 1px solid var(--c__background);
		height: 25px;
		margin-top: 5px;
		display: grid;
		justify-items: center;
		align-items: center;
		color: var(--c__green);
	}
</style>
