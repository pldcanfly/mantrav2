<script lang="ts">
	export let onDrop: (val: string | undefined) => any = () => {};
	let draggedover = false;
	const handleDragenter = (e: DragEvent) => {
		e.preventDefault();
		draggedover = true;
	};

	const handleDragleave = (e: DragEvent) => {
		e.preventDefault();
		draggedover = false;
	};

	const handleDrop = (e: DragEvent) => {
		draggedover = false;
		onDrop(e.dataTransfer?.getData('text'));
	};

	const handleDragover = (e: DragEvent) => {
		e.preventDefault();
	};
</script>

<div
	class="dropable"
	on:dragenter={handleDragenter}
	on:dragleave={handleDragleave}
	on:dragover={handleDragover}
	on:drop={handleDrop}
	class:draggedover
>
	<slot />
</div>

<style lang="scss">
	.dropable {
		position: relative;
		transition: all 0.2s;
		box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.5);
		background-color: var(--c__background);
		border: 1px solid var(--c__background);

		margin-top: 5px;
		display: grid;
		justify-items: center;
		align-items: center;

		&.draggedover {
			box-shadow: 0 0 10px var(--c__light-green);
		}
	}
</style>
