<script lang="ts">
	export let label: string;
</script>

<div class="labeled-input">
	<div class="label"><span>{label}</span></div>
	<slot />
</div>

<style lang="scss">
	.labeled-input {
		position: relative;
		display: inline-flex;
		align-items: stretch;
		transition: box-shadow 0.2s;

		&:hover {
			box-shadow: var(--c__shadow);
		}

		.label {
			display: flex;
			background-color: var(--c__lighter_background);
			border: 1px solid var(--c__highlight);
			border-right: none;
			align-items: center;
			padding: 10px;
		}
	}
</style>
