<script lang="ts">
	import { icons } from '$store/tables';

	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();

	export let icon: string = 'unknown';

	let selecting = false;

	const onEdit = () => {
		selecting = true;
	};

	const onSelect = (newicon: string) => {
		return () => {
			icon = newicon;
			selecting = false;
			dispatch('select');
		};
	};
</script>

<div class="iconselect">
	<img src={icons.get(icon)} alt="Icon" class="raidicon" on:click={onEdit} />
	{#if selecting}
		<div class="select">
			{#each [...icons] as [name, icon]}
				<img src={icon} alt="Icon" class="raidicon" on:click={onSelect(name)} />
			{/each}
		</div>
	{/if}
</div>

<style lang="scss">
	.select {
		z-index: 2;
		top: 0;
		left: 5px;
		position: absolute;
		display: grid;
		grid-template-rows: 1fr 1fr;
		grid-template-columns: 1fr 1fr 1fr 1fr 1fr;
		gap: 3px;
		background-color: var(--c__lighter_background);
		padding: 3px;
		box-shadow: var(--c__shadow);
	}

	:global {
		.iconselect {
			position: relative;
			.raidicon {
				cursor: pointer;
				width: 100px;
				height: 100px;
			}
			.select {
				position: absolute;
				top: 0;
				left: 0;
				.raidicon {
					filter: grayscale(1);
					transition: all 200ms;
					width: 60px;
					height: 60px;
				}
				.raidicon:hover {
					filter: grayscale(0);
					transform: scale(0.95);
				}
			}
		}
	}
</style>
