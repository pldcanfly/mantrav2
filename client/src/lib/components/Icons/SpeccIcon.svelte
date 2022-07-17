<script lang="ts">
	import { speccTable } from '$store/tables';

	export let specc: Specc;
	export let offspecc: Specc | undefined;
	export let size: number = 45;
</script>

<div
	class="speccicon icon"
	style:background-image="url({speccTable[specc].icon})"
	style:width="{size}px"
	style:height="{size}px"
>
	{#if offspecc}
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
