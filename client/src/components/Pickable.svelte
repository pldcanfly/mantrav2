<script lang="ts">
	export let data: string = '{}';
	let pickedup = false;

	const handleDragstart = (e: DragEvent) => {
		pickedup = true;
		e.dataTransfer?.setData('text/plain', data);
	};

	const handleDragend = () => {
		pickedup = false;
	};

	const handleDrag = (e: MouseEvent) => {};
</script>

<div
	class="container"
	class:pickedup
	on:dragstart={handleDragstart}
	on:drag={handleDrag}
	on:dragend={handleDragend}
	draggable="true"
>
	<slot />
</div>

<style lang="scss">
	.container {
		width: 100%;
	}
</style>
