export function removeAt<T = any>(arr: T[], index: number): T[] {

  if (index < 0 || index > arr.length - 1) {
    return arr;
  }

  return [
    ...arr.slice(0, index),
    ...arr.slice(index + 1),
  ];
}
