<script lang="ts">
	import { slide } from 'svelte/transition';
	import { mdiCheck, mdiHelp, mdiClose, mdiCommentText, mdiCommentEdit } from '@mdi/js';
	import SpeccIcon from '$components/Icons/SpeccIcon.svelte';
	import { classTable } from '$store/tables';
	import Icon from '$components/Icon.svelte';
	import type { iSignup } from 'src/app';
	import { isLoggedIn, accountid } from '$store/session';
	import { createEventDispatcher } from 'svelte';

	export let signup: iSignup;
	const emit = createEventDispatcher();

	let showComment = false;
	const character = signup.character;
	$: actions = $isLoggedIn && signup.character.accountid == $accountid;

	const onChange = () => {
		emit('changed');
	};

	const handleAccept = () => {
		signup.state = 'accepted';
		onChange();
	};
	const handleDecline = () => {
		signup.state = 'declined';
		onChange();
	};

	$: inroster = signup.position > -1;

	const toggleComment = () => {
		showComment = !showComment;
	};

	const setComment = (val: boolean) => {
		return () => {
			showComment = val;
		};
	};

	const savecomment = () => {
		showComment = false;
		onChange();
	};

	const sanitize = (val: string) => val.replaceAll('<', '&lt;').replaceAll('>', '&gt;');

	let commenticon = mdiCommentText;
	let commenticoncolor = 'var(--c__text)';
	$: {
		if (signup.comment) {
			commenticoncolor = 'var(--c__light-green)';
		}
		if (actions) {
			commenticon = mdiCommentEdit;
		}
	}
</script>

<div class="signup" class:actions={actions && !inroster} class:inroster>
	{#if showComment && (signup.comment || actions)}
		<div class="commentbox" transition:slide>
			{#if signup.comment && !actions}
				{@html sanitize(signup.comment).replaceAll('\n', '<br/>')}
			{/if}
			{#if actions}
				<div class="commentform">
					<textarea bind:value={signup.comment} />
					<div class="action" on:click={savecomment}>Speichern</div>
				</div>
			{/if}
		</div>
	{/if}
	<div class="class">
		<SpeccIcon specc={character.specc} offspecc={character.offspecc} size={inroster ? 30 : 40} />
	</div>
	<div class="text" style:color={classTable[character.clazz].color}>
		{character.name}
	</div>

	<div
		class="comment"
		on:click={toggleComment}
		on:blur={actions ? () => {} : setComment(false)}
		class:hascomment={signup.comment}
		class:pointer={signup.comment || actions}
		tabindex="0"
	>
		{#if signup.comment || actions}
			<Icon path={commenticon} width={inroster ? '20px' : '25px'} color={commenticoncolor} />
		{/if}
	</div>
	<div class="state {signup.state}">
		{#if signup.state == 'invited'}
			<Icon path={mdiHelp} width={inroster ? '20px' : '25px'} />
		{:else if signup.state == 'accepted'}
			<Icon path={mdiCheck} width={inroster ? '20px' : '25px'} />
		{:else}
			<Icon path={mdiClose} width={inroster ? '20px' : '25px'} />
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

<style lang="scss">
	@import '../../scss/global.scss';
	.signup {
		background-color: var(--c__lighter_background);
		position: relative;
		box-shadow: var(--c__shadow);
		display: grid;
		align-items: center;
		column-gap: 10px;

		grid-template-columns: 40px 1fr 40px 40px;

		&.inroster {
			grid-template-columns: 30px 1fr 30px 30px;
		}

		&.actions {
			grid-template-rows: 1fr 25px;
		}

		.commentbox {
			transform: translateY(100%);
			bottom: -5px;
			left: 0;
			right: 0;
			padding: 10px;
			box-shadow: var(--c_shadow);
			z-index: 3;
			position: absolute;
			background-color: var(--c__lighter_background);
			.commentform {
				display: grid;
				grid-template-columns: 1fr;
				grid-template-rows:
					1fr
					25px;

				.action {
					color: var(--c_text);
					border: 0;
					@include green-hoverable;
					display: grid;
					justify-content: center;
					align-items: center;
				}
				textarea {
					background-color: var(--c__background);
				}
			}
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
				color: var(--c_text);
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

		.comment.pointer {
			cursor: pointer;
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
