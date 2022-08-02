import { get, writable } from 'svelte/store';

export const notifications = writable<
	Array<{ type: 'error' | 'success'; message: string; id: string }>
>([]);

export function addNotification(message: string, type?: 'error' | 'success', timeout?: number) {
	const id = crypto.randomUUID();
	const note = { message, type: type || 'success', id: id };
	notifications.update((store) => [...store, note]);
	setTimeout(() => {
		notifications.update((store) => store.filter((item) => item.id !== id));
	}, timeout || 4000);
}
