import { inject } from '@angular/core';
import { Observable, from } from 'rxjs'
import { CollectionReference, DocumentData, Firestore, collection, doc, getDoc, getDocs, orderBy, query, where, writeBatch } from '@angular/fire/firestore';

import { DEFAULT_CATEGORY } from '@app/core/constants';
import { UserStore } from '@app/features/user/store';
import { CreateListItemDto, ListItem } from '../types';

export function createListCategoryItemsController() {

  const db = inject(Firestore);
  const userStore = inject(UserStore);

  const userId = userStore.userId;

  function createMany(items: CreateListItemDto[]): Observable<ListItem[]> {
    return from((async () => {
      const itemsRef = _getItemsRef();
      const batch = writeBatch(db);
      const createdItems: ListItem[] = [];

      // Logic here...
      items.forEach(item => {
        const itemData = {
          ...item,
          isDone: false,
          category: item?.category || DEFAULT_CATEGORY,
          description: item?.description || '',
        };

        // Create a new empty document reference with a unique ID
        const itemRef = doc(itemsRef);
        batch.set(itemRef, itemData);

        const createdItem: ListItem = { id: itemRef.id, ...itemData };
        createdItems.push(createdItem);
      });

      await batch.commit();
      return createdItems;
    })());
  }

  function complete(category: string): Observable<void> {
    return from(_completeOrUndo(category, true));
  }

  function undo(category: string): Observable<void> {
    return from(_completeOrUndo(category, false));
  }

  function removeCompleted(category: string): Observable<void> {
    return from((async () => {
      const itemsRef = _getItemsRef();
      const batch = writeBatch(db);
      const theQuery = query(
        itemsRef,
        where('category', '==', category),
        orderBy('category', 'asc'), // TODO: Needed?
      );
      const docs = await getDocs(theQuery);

      // TODO: Create composite index on category + isDone fields
      docs.forEach(doc => {
        if (doc.data()['isDone']) {
          batch.delete(doc.ref);
        }
      });

      await batch.commit();
    })());
  }

  function remove(category: string): Observable<void> {
    return from((async () => {
      const itemsRef = _getItemsRef();
      const batch = writeBatch(db);
      const theQuery = query(
        itemsRef,
        where('category', '==', category),
        orderBy('category', 'asc'), // TODO: Needed?
      );
      const docs = await getDocs(theQuery);
      docs.forEach(doc => batch.delete(doc.ref));
      await batch.commit();
    })());
  }

  function _getItemsRef(): CollectionReference<DocumentData> {
    if (!userId()) throw new Error('No user ID');
    return collection(db, 'lists', userId()!, 'items');
  }

  async function _completeOrUndo(category: string, isDone = true): Promise<void> {
    const itemsRef = _getItemsRef();
    const batch = writeBatch(db);
    const theQuery = query(
      itemsRef,
      where('category', '==', category),
      orderBy('category', 'asc'), // TODO: Needed?
    );
    const docs = await getDocs(theQuery);
    docs.forEach(doc => batch.update(doc.ref, { isDone }));
    await batch.commit();
  }

  return {
    createMany,
    complete,
    undo,
    removeCompleted,
    remove,
  };
}
