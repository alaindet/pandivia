import { inject } from '@angular/core';
import { Observable, from } from 'rxjs';
import {
  CollectionReference,
  DocumentData,
  Firestore,
  collection,
  getDocs,
  orderBy,
  query,
  where,
  writeBatch,
} from '@angular/fire/firestore';

import { ListItem } from '../types';
import { docsToListItems } from './utils';
import { UserStore } from '../../user/store';

// I Love You Puccipù
export function createListAllItemsController() {
  const db = inject(Firestore);
  const userStore = inject(UserStore);

  const userId = userStore.userId;

  function fetch(): Observable<ListItem[]> {
    return from(
      (async () => {
        const itemsRef = _getItemsRef();
        const docs = await getDocs(itemsRef);
        return docsToListItems(docs);
      })()
    );
  }

  function removeCompleted(): Observable<void> {
    return from(
      (async () => {
        const itemsRef = _getItemsRef();
        const batch = writeBatch(db);
        const theQuery = query(
          itemsRef,
          where('isDone', '==', true),
          orderBy('isDone', 'asc') // TODO: Needed?
        );
        const docs = await getDocs(theQuery);
        docs.forEach((doc) => batch.delete(doc.ref));
        await batch.commit();
      })()
    );
  }

  function complete(): Observable<void> {
    return from(_completeOrUndo(true));
  }

  function undo(): Observable<void> {
    return from(_completeOrUndo(false));
  }

  function remove(): Observable<void> {
    return from(
      (async () => {
        const itemsRef = _getItemsRef();
        const batch = writeBatch(db);
        const docs = await getDocs(itemsRef);
        docs.forEach((doc) => batch.delete(doc.ref));
        await batch.commit();
      })()
    );
  }

  async function _completeOrUndo(isDone = true): Promise<void> {
    const itemsRef = _getItemsRef();
    const batch = writeBatch(db);
    const theQuery = query(
      itemsRef,
      where('isDone', '==', !isDone),
      orderBy('isDone', 'asc') // TODO: Needed?
    );
    const docs = await getDocs(theQuery);
    docs.forEach((doc) => batch.update(doc.ref, { isDone }));
    await batch.commit();
  }

  function _getItemsRef(): CollectionReference<DocumentData> {
    if (!userId()) throw new Error('No user ID');
    return collection(db, 'lists', userId()!, 'items');
  }

  return {
    fetch,
    removeCompleted,
    complete,
    undo,
    remove,
  };
}
