import { inject } from '@angular/core';
import { Observable, from, of } from 'rxjs'
import { CollectionReference, DocumentData, Firestore, collection, getDocs, orderBy, query, where, writeBatch } from '@angular/fire/firestore';

import { UserStore } from '../../user/store';
import { CreateListItemDto, ListItem } from '../types';

export function createListCategoryItemsController() {

  const db = inject(Firestore);
  const userStore = inject(UserStore);

  const userId = userStore.userId;

  // TODO
  function createItemsInBatch(items: CreateListItemDto[]): Observable<ListItem[]> {

    // TODO: Remove
    console.log('createItemsInBatch', items);

    return of([]);
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
    createItemsInBatch,
    complete,
    undo,
    removeCompleted,
    remove,
  };
}
