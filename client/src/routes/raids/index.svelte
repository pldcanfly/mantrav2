<script lang="ts">
	import { blur } from 'svelte/transition';
	import { goto } from '$app/navigation';
	import Icon from '$components/Icon.svelte';
	import { mdiArrowLeft, mdiArrowRight } from '@mdi/js';
	import {
		startOfMonth,
		startOfWeek,
		getWeeksInMonth,
		addDays,
		format,
		isSameMonth,
		isSameDay,
		isWeekend,
		getWeek,
		subMonths,
		addMonths
	} from 'date-fns';
	import de from 'date-fns/locale/de/index.js';
	import type { iRaid } from './[raidid]';

	export let raids: Array<iRaid>;
	let date = new Date();
	let today = new Date();
	let showWeekend = true;

	const raidsforday = (date: Date) => {
		const result = [];
		for (const raid of raids) {
			if (isSameDay(new Date(raid.date), date)) {
				result.push({
					id: raid.id,
					name: raid.name,
					date: new Date(raid.date),
					size: raid.size
				});
			}
		}
		return result;
	};
</script>

<h1>Raids</h1>
<br />

Weekend: <input type="checkbox" bind:checked={showWeekend} />

<div class="nav">
	<div class="prevmonth switcher noselect" on:click={() => (date = subMonths(date, 1))}>
		<Icon path={mdiArrowLeft} width="25px" /> <span class="text">Vorheriger Monat</span>
	</div>
	<div class="current">
		{format(date, 'MMMM yyyy', { locale: de })}
	</div>
	<div class="nextmonth switcher noselect" on:click={() => (date = addMonths(date, 1))}>
		<span class="text">Nächster Monat</span><Icon path={mdiArrowRight} width="25px" />
	</div>
</div>

<div
	class="calendar"
	style:grid-template-columns={showWeekend ? '30px repeat(7, 1fr)' : '30px repeat(5, 1fr)'}
>
	<div />
	<div class="weekday">Montag</div>
	<div class="weekday">Dienstag</div>
	<div class="weekday">Mittwoch</div>
	<div class="weekday">Donnerstag</div>
	<div class="weekday">Freitag</div>
	{#if showWeekend}
		<div class="weekday">Samstag</div>
		<div class="weekday">Sonntag</div>
	{/if}

	{#each Array(getWeeksInMonth(date, { locale: de }) * 8) as _, offset}
		{@const day = addDays(
			startOfWeek(startOfMonth(date), { locale: de }),
			offset - Math.floor(offset / 8) - 1
		)}
		{#if offset % 8 == 0}
			<div class="kw">{getWeek(day)}</div>
		{:else if !isWeekend(day) || showWeekend}
			{@const raids = raidsforday(day)}

			{#key day}
				<div class="day" class:fade={!isSameMonth(day, date)} class:today={isSameDay(today, day)}>
					<div class="text">
						{format(day, 'EE dd. MMM')}
					</div>

					{#each raids as raid}
						<div class="raid" on:click={() => goto(`/raids/${raid.id}`)}>
							{raid.name} ({raid.size}) - {format(raid.date, 'HH:mm')}
						</div>
					{/each}
				</div>
			{/key}
		{/if}
	{/each}
</div>

<style lang="scss">
	@import '../../scss/global.scss';

	.nav {
		display: flex;
		justify-content: center;
		align-items: center;
		margin-bottom: 40px;

		.current {
			width: 150px;
			text-align: center;
		}

		.switcher {
			display: flex;
			margin: 10px;
			gap: 10px;
			@include green-hoverable;
			align-items: center;
			padding: 10px;
		}
	}

	.calendar {
		display: grid;
		gap: 20px;

		.kw {
			align-self: center;
		}
		.weekday {
			text-align: center;
		}

		.day {
			min-height: 100px;
			padding: 10px;
			box-shadow: var(--c__shadow);
			background-color: var(--c__lighter_background);

			&.today {
				.text {
					background-color: var(--c__light-red);
				}
			}

			.text {
				box-shadow: var(--c__shadow);
				margin: -10px;
				margin-bottom: 10px;
				padding: 5px;
				background-color: var(--c__highlight);
				font-weight: bolder;
			}
		}

		.fade {
			opacity: 0.5;
		}

		.raid {
			box-shadow: var(--c__shadow);
			padding: 5px;

			@include green-hoverable;

			& + .raid {
				margin-top: 10px;
			}
		}
	}
</style>
