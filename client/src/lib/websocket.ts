import { Manager, Socket } from 'socket.io-client';

const namespaces: Map<string, Socket> = new Map();
const manager = new Manager(import.meta.env.VITE_WS_URL);

const key = (name: string, audience?: string) => {
	return audience ? `${name}-${audience}` : name;
};

const wsopen = ({ name, audience }: { name: string; audience?: string }) => {
	if (!namespaces.has(key(name, audience))) {
		const socket = manager.socket(name.startsWith('/') ? name : `/${name}`);
		namespaces.set(key(name, audience), socket);
		// socket JOIN ROOM
		socket.emit('setAudience', audience);
	}
};

export const wson = ({
	name,
	audience,
	event,
	handler
}: {
	name: string;
	audience?: string;
	event: string;
	handler: (message: string) => void;
}) => {
	wsopen({ name, audience });
	return namespaces.get(key(name, audience))?.on(event, handler);
};

export const wssend = ({
	name,
	audience,
	event,
	message
}: {
	name: string;
	audience?: string;
	event: string;
	message?: string;
}) => {
	wsopen({ name, audience });
	if (message) {
		return namespaces.get(key(name, audience))?.emit(event, message);
	} else {
		return namespaces.get(key(name, audience))?.emit(event);
	}
};
