export function truncateTxt(value: string, length: number) {
	if (!value) return "";

	return value.length > length ? `${value.substring(0, length)}...` : value;
}
