<script lang="ts">
	import Label from './Label.svelte';

	export let value: any = undefined;
	export let label: string = '';
</script>

<Label bind:label>
	<input type="text" bind:value />
</Label>
