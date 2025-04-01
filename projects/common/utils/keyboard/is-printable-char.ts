export function isPrintableChar(event: KeyboardEvent): boolean {
  return !!(event.key.length === 1 && event.key.match(/\S/));
}
