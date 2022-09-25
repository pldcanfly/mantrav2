<script lang="ts">
	import ClassIcon from '$components/Icons/ClassIcon.svelte';
	import SpeccIcon from '$components/Icons/SpeccIcon.svelte';
	import { classTable } from '$store/tables';
	import type { Clazz, Specc } from 'src/app';

	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();
	export let specc: Specc | undefined = 'unknown';
	export let empty: boolean = false;
	export let clazz: Clazz;

	let selecting = false;

	const onEdit = () => {
		selecting = true;
	};

	const onSelect = (newspecc: Specc | undefined) => {
		return () => {
			specc = newspecc;
			dispatch('select');
			selecting = false;
		};
	};
</script>

<div class="speccselect">
	<SpeccIcon {specc} click={onEdit} />
	{#if selecting}
		<div class="select">
			<div class="main specclist">
				{#if empty}
					<SpeccIcon specc="unknown" click={onSelect(undefined)} />
				{/if}
				{#each classTable[clazz].speccs as clazzspecc}
					<SpeccIcon specc={clazzspecc} click={onSelect(clazzspecc)} />
				{/each}
			</div>
		</div>
	{/if}
</div>

<style lang="scss">
	.select {
		width: 100%;
		height: 100%;
		z-index: 2;
		top: 0;
		left: 0;
		opacity: 0.9;
		position: absolute;
		display: grid;
		justify-items: center;

		gap: 3px;
		background-color: var(--c__lighter_background);

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
