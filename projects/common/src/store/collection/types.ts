export type SortingFn<T = any> = (a: T, b: T) => -1 | 0 | 1;

export type CategorizedItems<T extends Record<string, any>> = {
  category: string;
  items: T[];
};
