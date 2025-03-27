import { getRandomHash } from '@common/utils';
import { ListItem } from '@app/features/list';
import { InventoryItem } from '@app/features/inventory';
import {
  MOCK_CATEGORY_FOO,
  MOCK_CATEGORY_BAR,
  MOCK_CATEGORY_BAZ,
} from './categories';

export const MOCK_INVENTORY_ITEMS: InventoryItem[] = [
  {
    id: getRandomHash(5),
    name: 'Ice-cream',
    description: 'Delicious ice-cream',
    category: MOCK_CATEGORY_BAR,
  },
  {
    id: getRandomHash(5),
    name: 'Eggs',
    description: 'Pick any eggs you like',
    category: MOCK_CATEGORY_BAR,
  },
  {
    id: getRandomHash(5),
    name: 'Bread',
    description: '100g of bread',
    category: MOCK_CATEGORY_FOO,
  },
  {
    id: getRandomHash(5),
    name: 'Butter',
    description: '200g',
    category: MOCK_CATEGORY_BAZ,
  },
  {
    id: getRandomHash(5),
    name: 'Tomatos',
    description: '100g',
    category: MOCK_CATEGORY_BAZ,
  },
];

export const MOCK_LIST_ITEMS: ListItem[] = [
  {
    id: getRandomHash(5),
    name: 'Strawberries',
    amount: 1,
    isDone: false,
    description:
      'Esse irure cillum laboris velit in. Veniam dolor minim duis sit nostrud',
    category: MOCK_CATEGORY_FOO,
  },
  {
    id: getRandomHash(5),
    name: 'Potato Chips',
    amount: 2,
    isDone: false,
    description:
      'Minim laborum ad commodo exercitation officia aliqua dolore proident laborum amet laborum. Quis amet sint incididunt est elit.',
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
