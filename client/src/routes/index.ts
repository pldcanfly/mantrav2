export async function get() {
	return {
		status: 308,
		headers: {
			location: `/raids/`
		}
	};
}
