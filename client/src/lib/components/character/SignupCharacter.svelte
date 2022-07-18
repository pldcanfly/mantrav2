<script lang="ts">
	import type { iSignup } from 'src/routes/raids/[raidid]';

	import { mdiCheck, mdiHelp, mdiClose, mdiCommentText } from '@mdi/js';

	import SpeccIcon from '$lib/components/Icons/SpeccIcon.svelte';

	import { classTable } from '$store/tables';
	import Icon from '$lib/components/Icon.svelte';

	export let signup: iSignup;
	let actions = signup.actions;

	const handleAccept = () => {
		signup.state = 'accepted';
	};
	const handleDecline = () => {
		signup.state = 'declined';
	};
</script>

{#if signup.position == -1 && ['invited', 'accepted', 'declined'].includes(signup.state)}
	{@const character = signup.character}
	<div class="signup" class:actions>
		<div class="class">
			<SpeccIcon specc={character.specc} offspecc={character.offspecc} size={40} />
		</div>
		<div class="text" style:color={classTable[character.clazz].color}>
			{character.name}
			{signup.position}
		</div>
		<div class="comment">
			{#if signup.comment}
				<Icon path={mdiCommentText} width={'25px'} color="var(--c__light-green)" />
			{:else}
				<Icon path={mdiCommentText} width={'25px'} />
			{/if}
		</div>
		<div class="state {signup.state}">
			{#if signup.state == 'invited'}
				<Icon path={mdiHelp} width={'25px'} />
			{:else if signup.state == 'accepted'}
				<Icon path={mdiCheck} width={'25px'} />
			{:else}
				<Icon path={mdiClose} width={'25px'} />
			{/if}
		</div>
		{#if actions}
			<div
				class="action-container"
				style={signup.state == 'invited'
					? 'grid-template-columns: 1fr 1fr;'
					: 'grid-template-columns: 1fr;'}
			>
				{#if signup.state != 'accepted'}
					<div class="action accept" on:click={handleAccept}>Anmelden</div>
				{/if}
				{#if signup.state != 'declined'}
					<div class="action decline" on:click={handleDecline}>Abmelden</div>
				{/if}
			</div>
		{/if}
	</div>
{:else}
	{signup.character.name} {signup.state}
{/if}

<style lang="scss">
	.signup {
		background-color: var(--c__lighter_background);

		box-shadow: var(--c__shadow);
		display: grid;
		align-items: center;
		column-gap: 10px;

		grid-template-columns: 40px 1fr 40px 40px;

		&.actions {
			grid-template-rows: 1fr 25px;
		}

		.action-container {
			grid-column: span 4;
			display: grid;

			height: 100%;
			border-top: 1px solid var(--c__background);

			.action {
				display: grid;
				align-items: center;
				justify-items: center;
				cursor: pointer;
				transition: background-color 0.2s;
				&.accept {
					background-color: var(--c__green);
					&:hover {
						background-color: var(--c__light-green);
					}
				}
				&.decline {
					background-color: var(--c__red);
					&:hover {
						background-color: var(--c__light-red);
					}
				}
			}
		}

		.text {
			padding: 5px;
			padding-left: 10px;
		}
		.comment,
		.state {
			display: grid;
			align-items: center;
			justify-items: center;
			height: 100%;
			width: 100%;
		}

		.state.invited {
			background-color: var(--c__highlight);
		}

		.state.accepted {
			background-color: var(--c__green);
		}

		.state.declined {
			background-color: var(--c__red);
		}
	}
</style>
