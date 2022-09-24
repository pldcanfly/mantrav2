<script lang="ts">
	import ClassIcon from '$components/Icons/ClassIcon.svelte';
	import { raceTable } from '$store/tables';

	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();
	export let clazz: Clazz;
	export let race: Race;

	let selecting = false;

	const onEdit = () => {
		selecting = true;
	};

	const onSelect = (newclass: Clazz) => {
		return () => {
			clazz = newclass;
			dispatch('select');
			selecting = false;
		};
	};
</script>

<div class="classselect">
	<ClassIcon {clazz} click={onEdit} />
	{#if selecting}
		<div class="select">
			{#each raceTable[race].classes as raceclazz}
				<ClassIcon clazz={raceclazz} click={onSelect(raceclazz)} />
			{/each}
		</div>
	{/if}
</div>

<style lang="scss">
	.select {
		z-index: 2;
		top: 4px;
		left: 5px;
		position: absolute;
		display: grid;
		grid-template-rows: 1fr;
		grid-template-columns: 1fr 1fr 1fr 1fr 1fr;
		gap: 3px;
		background-color: var(--c__lighter_background);
		padding: 3px;
		box-shadow: var(--c__shadow);
	}

	:global {
		.classselect {
			.classicon {
				cursor: pointer;
			}
			.select {
				.classicon {
					filter: grayscale(1);
					transition: all 200ms;
				}
				.classicon:hover {
					filter: grayscale(0);
					transform: scale(0.95);
				}
			}
		}
	}
</style>
