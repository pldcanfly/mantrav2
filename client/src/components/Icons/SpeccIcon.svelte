<script lang="ts">
	import { speccTable } from '$store/tables';
	import type { Specc } from 'src/app';

	export let specc: Specc;
	export let offspecc: Specc | undefined = undefined;
	export let size: number = 45;
	export let click: any = () => undefined;
</script>

<div
	class="speccicon icon"
	style:background-image="url({speccTable[specc].icon})"
	style:width="{size}px"
	style:height="{size}px"
	on:click={click}
>
	{#if offspecc && offspecc !== 'unknown'}
		<div
			class="offspeccicon"
			style:background-image="url({speccTable[offspecc].icon})"
			style:width="{size / 2}px"
			style:height="{size / 2}px"
			style:bottom="-{size / 6}px"
			style:right="-{size / 6}px"
		/>
	{/if}
</div>

<style lang="scss">
	.speccicon {
		position: relative;
	}
	.speccicon {
		background-size: cover;
	}

	.offspeccicon {
		position: absolute;
		//border: 1px dashed black;
		border-radius: 50%;
		box-shadow: var(--c__shadow);
		//filter: saturate(0.5);

		background-size: cover;
	}
</style>
