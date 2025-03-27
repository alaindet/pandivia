export type CategorizedItems<T extends Record<string, any>> = {
  category: string;
  items: T[];
};
