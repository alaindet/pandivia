import { ActionsMenuItem } from '../menu/actions-menu';

export type Item = { id: string } & Record<string, any>;

export type ItemActionsFn<T = any> = (item: T) => ActionsMenuItem[];

export type ItemActionOutput = { itemId: string, action: string };

export type ItemToggledOutput = { itemId: string, isDone: boolean };
