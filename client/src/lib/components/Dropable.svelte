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

		&::after {
			z-index: 2;
			position: absolute;
			content: '';

			top: 0;
			left: 0;
			right: 0;
			bottom: 0;
			opacity: 0;
			transition: all 0.2s;
		}

		&.draggedover {
			&::after {
				border: 3px solid var(--c__green);
				background-color: var(--c__dark-green);
				box-shadow: var(--c__shadow);
				opacity: 0.8;
			}
		}
	}
</style>
