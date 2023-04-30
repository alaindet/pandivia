export function asBoolean(val: any): boolean {
	if (typeof val === 'number') return val !== 0;
	return !!val || val === '';
}
