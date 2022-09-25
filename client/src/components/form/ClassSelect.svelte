<script lang="ts">
	import ClassIcon from '$components/Icons/ClassIcon.svelte';
	import { raceTable } from '$store/tables';
	import type { Clazz, Race } from 'src/app';

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
		<div class="selectcontainer">
			<div class="select">
				{#each raceTable[race].classes as raceclazz}
					<ClassIcon clazz={raceclazz} click={onSelect(raceclazz)} />
				{/each}
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
		grid-template-rows: 1fr;
		grid-template-columns: 1fr 1fr 1fr 1fr;
		gap: 5px;
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
