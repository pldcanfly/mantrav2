<script lang="ts">
	import ClassIcon from '$components/Icons/ClassIcon.svelte';
	import SpeccIcon from '$components/Icons/SpeccIcon.svelte';
	import { classTable } from '$store/tables';

	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();
	export let specc: Specc = 'unknown';
	export let offspecc: Specc | undefined = undefined;
	export let clazz: Clazz;

	let selecting = false;

	const onEdit = () => {
		selecting = true;
	};

	const onSelect = (newspecc: Specc) => {
		return () => {
			specc = newspecc;
			dispatch('select');
			selecting = false;
		};
	};

	const onSelectOffspec = (newspecc: Specc | undefined) => {
		return () => {
			offspecc = newspecc;
			dispatch('select');
			selecting = false;
		};
	};
</script>

<div class="speccselect">
	<SpeccIcon {specc} {offspecc} click={onEdit} />
	{#if selecting}
		<div class="select">
			Main:
			<div class="main specclist">
				{#each classTable[clazz].speccs as clazzspecc}
					<SpeccIcon specc={clazzspecc} click={onSelect(clazzspecc)} />
				{/each}
			</div>
			Second:
			<div class="off specclist">
				<SpeccIcon specc="unknown" click={onSelectOffspec(undefined)} />

				{#each classTable[clazz].speccs as clazzspecc}
					<SpeccIcon specc={clazzspecc} click={onSelectOffspec(clazzspecc)} />
				{/each}
			</div>
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
		grid-template-rows: 1fr 1fr;
		grid-template-columns: 1fr 1fr;
		gap: 3px;
		background-color: var(--c__lighter_background);
		padding: 3px;
		box-shadow: var(--c__shadow);
		align-items: center;
	}

	:global {
		.speccselect {
			.speccicon {
				cursor: pointer;
			}
			.select {
				.speccicon {
					filter: grayscale(0.5);
					transition: all 200ms;
				}
				.speccicon:hover {
					filter: grayscale(0);
					transform: scale(0.95);
				}

				.specclist {
					display: flex;
				}
			}
		}
	}
</style>
