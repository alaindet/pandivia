export type LocalStorageItemOptions<T = any> = {
  serialize: (value: T) => string;
  deserialize: (raw: string) => T;
  default: T;
};

export function createLocalStorageItemController<T = any>(
  key: string,
  options: LocalStorageItemOptions<T>,
) {

  function write(value: T) {
    const serialized = options.serialize(value);
    window.localStorage.setItem(key, serialized);
  }

  function read(): T {
    const raw = window.localStorage.getItem(key);
    if (!raw) return options.default;
    return options.deserialize(raw);
  }

  function clear(): void {
    window.localStorage.removeItem(key);
  }

  return {
    write,
    read,
    clear,
  };
}
