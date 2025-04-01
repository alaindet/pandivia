export type LocalStorageItemOptions<T = any> = {
  serialize: (value: T) => string;
  deserialize: (raw: string) => T;
  default: T;
};

export class LocalStorageItemController<T extends any> {
  constructor(
    public key: string,
    private options: LocalStorageItemOptions<T>
  ) {}

  write(value: T) {
    const serialized = this.options.serialize(value);
    window.localStorage.setItem(this.key, serialized);
  }

  read(): T {
    const raw = window.localStorage.getItem(this.key);
    if (!raw) return this.options.default;
    return this.options.deserialize(raw);
  }

  clear(): void {
    window.localStorage.removeItem(this.key);
  }
}
