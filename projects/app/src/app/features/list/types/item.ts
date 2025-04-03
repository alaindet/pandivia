import { CardListItem } from '@fruit/components';

export type ListItem = CardListItem & {
  id: string;
  name: string;
  description?: string;
  category?: string;
  isDone: boolean;
  amount: number;
};

export type CreateListItemDto = Omit<ListItem, 'id' | 'isDone'>;
