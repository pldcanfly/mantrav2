export async function GET() {
	return {
		status: 308,
		headers: {
			location: `/raids/`
		}
	};
}
