<script lang="ts">
	import { slide } from 'svelte/transition';
	import { flip } from 'svelte/animate';
	import { notifications } from '$store/notification';
</script>

<div class="notifications">
	{#each $notifications as { message, type, id } (id)}
		<div class="{type} notification" transition:slide animate:flip>
			{message}
		</div>
	{/each}
</div>

<style lang="scss">
	.notifications {
		position: fixed;
		top: 50px;
		left: 50%;
		transform: translateX(-50%);

		.notification {
			padding: 20px;

			&.success {
				background-color: var(--c__green);
			}
			&.error {
				background-color: var(--c__red);
			}
		}
	}
</style>
