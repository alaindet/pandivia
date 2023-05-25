import { ActionsMenuItem } from '../menu/actions-menu';

export type Item = { id: string } & Record<string, any>;

export type ItemActionsFn = <T extends any>(item: T) => ActionsMenuItem[];

export type ItemActionOutput = { itemId: string, action: string };