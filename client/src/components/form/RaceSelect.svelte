<script lang="ts">
	import RaceIcon from '$components/Icons/RaceIcon.svelte';
	import type { Race } from 'src/app';
	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();

	export let race: Race;
	export let female: boolean;

	let selecting = false;

	const onEdit = () => {
		console.log('clicked');
		selecting = true;
	};

	const onSelect = (newrace: Race, newgender: boolean) => {
		return () => {
			race = newrace;
			female = newgender;
			selecting = false;
			dispatch('select');
		};
	};
</script>

<div class="raceselect">
	<RaceIcon {race} {female} click={onEdit} />
	{#if selecting}
		<div class="selectcontainer">
			<div class="select">
				<RaceIcon race="undead" click={onSelect('undead', false)} />
				<RaceIcon race="orc" click={onSelect('orc', false)} />
				<RaceIcon race="tauren" click={onSelect('tauren', false)} />
				<RaceIcon race="troll" click={onSelect('troll', false)} />
				<RaceIcon race="bloodelf" click={onSelect('bloodelf', false)} />

				<RaceIcon race="undead" female click={onSelect('undead', true)} />
				<RaceIcon race="orc" female click={onSelect('orc', true)} />
				<RaceIcon race="tauren" female click={onSelect('tauren', true)} />
				<RaceIcon race="troll" female click={onSelect('troll', true)} />
				<RaceIcon race="bloodelf" female click={onSelect('bloodelf', true)} />
			</div>
		</div>
	{/if}
</div>

<style lang="scss">
	.selectcontainer {
		width: 100%;
		height: 100%;
		top: 0;
		left: 0;
		position: absolute;
		background-color: var(--c__lighter_background);
		box-shadow: var(--c__shadow);
		display: grid;
		justify-content: center;
		align-items: center;
		z-index: 2;
		opacity: 0.9;
	}
	.select {
		display: grid;
		grid-template-rows: 1fr 1fr;
		grid-template-columns: 1fr 1fr 1fr 1fr 1fr;
		gap: 5px;
	}

	:global {
		.raceselect {
			.raceicon {
				cursor: pointer;
			}
			.select {
				.raceicon {
					filter: grayscale(1);
					transition: all 200ms;
				}
				.raceicon:hover {
					filter: grayscale(0);
					transform: scale(0.95);
				}
			}
		}
	}
</style>
