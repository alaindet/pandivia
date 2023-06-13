/**
 * Immutably replaces an element in an array, given the index
 *
 * Ex.:
 * const arr = [100, 200, 300];
 * const arr2 = replaceAt(arr, 1, 4242);
 * console.log(arr2); // [100, 4242, 300]
 */
export function replaceAt<T = any>(
  arr: T[],
  index: number | undefined,
  item: T,
): T[] {

  if (typeof index === 'undefined' || index < 0 || index > arr.length - 1) {
    return arr;
  }

  return [
    ...arr.slice(0, index),
    item,
    ...arr.slice(index + 1),
  ];
}

/**
 * Immutably replaces an element in an array via a replacer function, given the index
 * The replacer function accepts the old element and returns the new element
 *
 * Ex.:
 * const arr = [100, 200, 300];
 * const arr2 = replaceWith(arr, 1, n => n + 13);
 * console.log(arr2); // [100, 213, 300]
 */
export function replaceWith<T = any>(
  arr: T[],
  index: number,
  replacerFn: (oldItem: T) => T,
): T[] {
  return replaceAt(arr, index, replacerFn({ ...arr[index] }));
}

/**
 * Immutably replaces via a function all elements in an array that match a search
 * The searcher function accepts an element and its index and returns a boolean
 * The replacer function accepts the old element and returns the new element
 *
 * Ex.:
 * const arr = [100, 200, 300, 200];
 * const arr2 = replaceOn(arr, n => n === 200, n => n + 13)
 * console.log(arr2); // [100, 213, 300, 213]
 */
export function replaceOn<T = any>(
  arr: T[],
  searcherFn: (item: T, index: number) => boolean,
  replacerFnOrNewItem: T | ((oldItem: T) => T),
): T[] {

  let replacerFn = replacerFnOrNewItem as (oldItem: T ) => T;

  if (typeof replacerFn !== 'function') {
    const newItem: T = replacerFnOrNewItem as T;
    replacerFn = () => newItem;
  }

  return arr.map((item, index) => {
    return searcherFn(item, index) ? replacerFn(item) : item;
  });
}
