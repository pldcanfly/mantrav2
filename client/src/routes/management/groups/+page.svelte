<script lang="ts">
	import Character from '$components/character/Character.svelte';
	import Dropable from '$components/Dropable.svelte';
	import Pickable from '$components/Pickable.svelte';
	import { API } from '$lib/api';

	import type { iCharacter, iGroup } from 'src/app';
	import { onMount } from 'svelte';

	export let data: { groups: Array<iGroup> };
	let { groups } = data;
	let characters: Array<iCharacter> = [];
	let changed: Set<string> = new Set();

	onMount(async () => {
		API({ url: '/characters' }).then((res) => {
			characters = res.data.message;
		});
	});

	const inGroup = (grp: iGroup, member: iCharacter) => {
		for (const grpmember of grp.members) {
			if (grpmember.id === member.id) return true;
		}
		return false;
	};

	const toggleMembership = (grp: iGroup, member: iCharacter) => {
		return () => {
			if (inGroup(grp, member)) {
				grp.members = grp.members.filter((item) => item.id !== member.id);
			} else {
				grp.members.push(member);
			}
			characters = characters;
			save();
		};
	};

	const save = () => {
		changed = new Set();
		API({ method: 'post', url: '/groups', data: groups });
	};
</script>

<h1>Gruppenverwaltung</h1>

<div class="groupmanagementgrid">
	<div class="groups">
		<h2>Gruppen</h2>
		{#each groups as group}
			<div class="groupgrid">
				<div class="header">
					{group.name}
					<!-- <input bind:value={group.name} /><button on:click={save}>Save</button> -->
				</div>

				<div class="charactergrid">
					{#each characters as character}
						<div
							class:selected={inGroup(group, character)}
							on:click={toggleMembership(group, character)}
						>
							<Character {character} />
						</div>
					{/each}
				</div>
			</div>
		{/each}
	</div>
</div>

<style lang="scss">
	.groupmanagementgrid {
		.groups {
			.groupgrid {
				width: 100%;
				display: grid;
				box-shadow: var(--c__shadow);
				margin-bottom: 20px;

				gap: 20px;

				.header {
					background-color: var(--c__lighter_background);
					padding: 15px;
					box-shadow: var(--c__shadow);
				}

				.charactergrid {
					display: flex;
					gap: 20px;
					flex-wrap: wrap;
					padding: 20px;
					padding-top: 0px;

					:global(.character) {
						cursor: pointer;
					}

					.selected {
						:global(.character) {
							background-color: var(--c__dark-green);
						}
					}
				}
			}
		}
	}
</style>
