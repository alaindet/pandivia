import { inject } from '@angular/core';
import { Observable, from } from 'rxjs'
import { Store } from '@ngrx/store';
import { CollectionReference, DocumentData, Firestore, collection, getDocs, orderBy, query, where, writeBatch } from '@angular/fire/firestore';

import { selectUserId } from '@app/features/user/store';

export function createListCategoryItemsController() {

  const db = inject(Firestore);
  const userId = inject(Store).selectSignal(selectUserId);

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
    complete,
    undo,
    removeCompleted,
    remove,
  };
}
