import { inject } from '@angular/core';
import { Observable, from } from 'rxjs'
import { CollectionReference, DocumentData, Firestore, addDoc, collection, deleteDoc, doc, getDoc, updateDoc } from '@angular/fire/firestore';

import { DEFAULT_CATEGORY } from '@app/core/constants';
import { CreateListItemDto, ListItem } from '../types';
import { docToListItem } from './utils';
import { UserStore } from '../../user/store';

export function createListItemController() {

  const db = inject(Firestore);
  const userStore = inject(UserStore);

  const userId = userStore.userId;

  function create(dto: CreateListItemDto): Observable<ListItem> {
    return from((async () => {
      const itemsRef = _getItemsRef();
      const itemData = {
        ...dto,
        isDone: false,
        category: dto?.category || DEFAULT_CATEGORY,
        description: dto?.description || '',
      };
      const itemRef = await addDoc(itemsRef, itemData);
      const itemDoc = await getDoc(itemRef);
      return docToListItem(itemDoc);
    })());
  }

  function edit(editedItem: ListItem): Observable<ListItem> {
    const { id, ...dto } = editedItem;
    dto.category = dto?.category || DEFAULT_CATEGORY;
    dto.description = dto?.description || '';
    return from(_editItem(id, () => dto));
  }

  function complete(itemId: ListItem['id']): Observable<ListItem> {
    return from(_editItem(itemId, () => ({ isDone: true })));
  }

  function undo(itemId: ListItem['id']): Observable<ListItem> {
    return from(_editItem(itemId, () => ({ isDone: false })));
  }

  function toggle(itemId: ListItem['id']): Observable<ListItem> {
    return from(_editItem(itemId, old => ({ isDone: !old.isDone })));
  }

  function increment(itemId: ListItem['id']): Observable<ListItem> {
    return from(_editItem(itemId, old => ({ amount: old.amount + 1 })));
  }

  function decrement(itemId: ListItem['id']): Observable<ListItem> {
    return from(_editItem(itemId, old => ({ amount: old.amount - 1 })));
  }

  function remove(itemId: ListItem['id']): Observable<ListItem> {
    if (!userId()) throw new Error('No user ID');
    return from((async () => {
      const itemRef = doc(db, 'lists', userId()!, 'items', itemId);
      const itemDoc = await getDoc(itemRef);
      await deleteDoc(itemRef);
      return docToListItem(itemDoc);
    })());
  }

  function _getItemsRef(): CollectionReference<DocumentData> {
    if (!userId()) throw new Error('No user ID');
    return collection(db, 'lists', userId()!, 'items');
  }

  async function _editItem(
    itemId: string,
    updater: (oldItem: Omit<ListItem, 'id'>) => Partial<ListItem>,
  ): Promise<ListItem> {
    if (!userId()) throw new Error('No user ID');
    const itemRef = doc(db, 'lists', userId()!, 'items', itemId);
    const oldItemDoc = await getDoc(itemRef);
    const oldData = docToListItem(oldItemDoc);
    const patch = updater(oldData);
    const newData = { ...oldData, ...patch };
    await updateDoc(itemRef, patch);
    return newData;
  }

  return {
    create,
    edit,
    complete,
    undo,
    toggle,
    increment,
    decrement,
    remove,
  };
}
