import { createAction, createActionGroup, emptyProps, props } from '@ngrx/store';

import { ListFilter, CreateListItemDto, ListItem } from '../types';

// export const listCategoryActions = createActionGroup({
//   source: 'List/Category',
//   events: {
//     complete: props<{ category: string }>(),
//     undo: props<{ category: string }>(),
//     removeCompleted: props<{ category: string }>(),
//     remove: props<{ category: string }>(),
//   },
// });

// export const listItemActions = createActionGroup({
//   source: 'List/Item',
//   events: {
//     create: props<{ dto: CreateListItemDto }>(),
//     edit: props<{ item: ListItem }>(),
//     complete: props<{ itemId: string }>(),
//     undo: props<{ itemId: string }>(),
//     toggle: props<{ itemId: string }>(),
//     increment: props<{ itemId: string }>(),
//     decrement: props<{ itemId: string }>(),
//     remove: props<{ itemId: string }>(),
//   },
// });

// export const listItemsAsyncReadActions = createActionGroup({
//   source: 'List/Items/AsyncRead',
//   events: {
//     fetchItems: emptyProps(),
//     fetchItemsCached: emptyProps(),
//     forceFetchItems: emptyProps(),
//     fetchItemsSuccess: props<{ items: ListItem[] }>(),
//     fetchItemsError: props<{ message: string }>(),
//   },
// });

// TODO: https://firebase.google.com/docs/firestore/manage-data/transactions
// export const listItemsAsyncWriteActions = createActionGroup({
//   source: 'List/Items/AsyncWrite',
//   events: {
//     editSuccess: props<{ message: string, items: ListItem[] }>(),
//     editError: props<{ message: string }>(),
//     removeSuccess: props<{ message: string, items: ListItem[] }>(),
//     removeError: props<{ message: string }>(),
//   },
// });

// export const listItemAsyncWriteActions = createActionGroup({
//   source: 'List/Item/AsyncWrite',
//   events: {
//     createSuccess: props<{ message: string, item: ListItem }>(),
//     createError: props<{ message: string }>(),

//     editSuccess: props<{ message: string, item: ListItem }>(),
//     editError: props<{ message: string }>(),

//     removeSuccess: props<{ message: string, item: ListItem }>(),
//     removeError: props<{ message: string }>(),
//   },
// });
