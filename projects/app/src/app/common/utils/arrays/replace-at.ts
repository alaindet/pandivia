export function replaceAt<T = any>(arr: T[], index: number | undefined, item: T): T[] {

  if (typeof index === 'undefined' || index < 0 || index > arr.length - 1) {
    return arr;
  }

  return [
    ...arr.slice(0, index),
    item,
    ...arr.slice(index + 1),
  ];
}

export function replaceWith<T = any>(
  arr: T[],
  index: number,
  transform: (oldItem: T) => T,
): T[] {
  return replaceAt(arr, index, transform({ ...arr[index] }));
}
