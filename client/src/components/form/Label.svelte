<script lang="ts">
	export let label: string;
	export let width: string = 'auto';
	export let labelontop = false;
</script>

<div class="labeled-input" class:labelontop>
	<div class="label" style:width><span>{label}</span></div>
	<slot />
</div>

<style lang="scss">
	.labeled-input {
		position: relative;
		display: inline-grid;
		align-items: stretch;
		transition: box-shadow 0.2s;
		grid-template-columns: auto 1fr;
		width: 100%;

		&.labelontop {
			grid-template-columns: 1fr;
		}

		&:hover {
			box-shadow: var(--c__shadow);
		}

		.label {
			display: inline-flex;

			background-color: var(--c__lighter_background);
			border: 1px solid var(--c__highlight);
			border-right: none;
			align-items: center;
			align-self: flex-start;
			padding: 10px;
		}
	}
</style>
