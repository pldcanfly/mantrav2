export async function get() {
	return {
		body: {
			number: Math.random()
		}
	};
}
