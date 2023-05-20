import { getRandomHash } from '@app/common/utils';
import { ListItem } from '@app/features/list';
import { MOCK_CATEGORY_BAR, MOCK_CATEGORY_FOO } from './categories';

export const MOCK_ITEMS: ListItem[] = [
  {
    id: getRandomHash(5),
    name: 'Strawberries',
    amount: 1,
    isDone: false,
    description: 'Esse irure cillum laboris velit in. Veniam dolor minim duis sit nostrud',
    category: MOCK_CATEGORY_FOO,
  },
  {
    id: getRandomHash(5),
    name: 'Potato Chips',
    amount: 2,
    isDone: false,
    description: 'Minim laborum ad commodo exercitation officia aliqua dolore proident laborum amet laborum. Quis amet sint incididunt est elit.',
    category: MOCK_CATEGORY_FOO,
  },
  {
    id: getRandomHash(5),
    name: 'Biscuits',
    amount: 1,
    isDone: false,
    category: MOCK_CATEGORY_BAR,
  },
];
