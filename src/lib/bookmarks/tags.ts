export function parseTags(input: string): string[] {
	const tags = input
		.split(',')
		.map((tag) => tag.trim().toLowerCase())
		.filter((tag) => tag.length > 0);

	return [...new Set(tags)];
}
