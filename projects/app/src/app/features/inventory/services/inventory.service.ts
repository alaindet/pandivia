import { Injectable, inject } from '@angular/core';
import { Observable, from } from 'rxjs';
import { Store } from '@ngrx/store';
import { CollectionReference, DocumentData, DocumentSnapshot, Firestore, QuerySnapshot, addDoc, collection, doc, getDoc, getDocs, updateDoc, deleteDoc, writeBatch, query, where, orderBy } from '@angular/fire/firestore';

import { selectUserId } from '@app/features/user/store';
import { CreateInventoryItemDto, InventoryItem } from '../types';

@Injectable({
  providedIn: 'root',
})
export class InventoryService {

  private db = inject(Firestore);
  private store = inject(Store);
  private userId = this.store.selectSignal(selectUserId);

  getItems(): Observable<InventoryItem[]> {
    return from((async () => {
      const itemsRef = this.getItemsRef();
      const docs = await getDocs(itemsRef);
      return this.docsToInventoryItems(docs);
    })());
  }

  createItem(dto: CreateInventoryItemDto): Observable<InventoryItem> {
    return from((async () => {
      const itemsRef = this.getItemsRef();
      const itemRef = await addDoc(itemsRef, dto);
      const itemDoc = await getDoc(itemRef);
      return this.docToInventoryItem(itemDoc);
    })());
  }

  editItem(editedItem: InventoryItem): Observable<InventoryItem> {
    return from((async () => {
      const userId = this.userId()!;
      const itemId = editedItem.id;
      const itemRef = doc(this.db, 'inventories', userId, 'items', itemId);
      const { id: _, ...dto } = editedItem;
      await updateDoc(itemRef, dto);
      return editedItem;
    })());
  }

  removeItem(itemId: InventoryItem['id']): Observable<InventoryItem> {
    return from((async () => {
      const userId = this.userId()!;
      const itemRef = doc(this.db, 'inventories', userId, 'items', itemId);
      const itemDoc = await getDoc(itemRef);
      await deleteDoc(itemRef);
      return this.docToInventoryItem(itemDoc);
    })());
  }

  removeByCategory(category: string): Observable<void> {
    return from((async () => {
      const itemsRef = this.getItemsRef();
      const batch = writeBatch(this.db);
      const theQuery = query(
        itemsRef,
        where('category', '==', category),
        orderBy('category', 'asc'),
      );
      const docs = await getDocs(theQuery);
      docs.forEach(doc => batch.delete(doc.ref));
      await batch.commit();
    })());
  }

  removeAll(): Observable<void> {
    return from((async () => {
      const itemsRef = this.getItemsRef();
      const batch = writeBatch(this.db);
      const docs = await getDocs(itemsRef);
      docs.forEach(doc => batch.delete(doc.ref));
      await batch.commit();
    })());
  }

  private getItemsRef(): CollectionReference<DocumentData> {

    if (!this.userId()) {
      throw new Error('No user ID');
    }

    const userId = this.userId()!;
    return collection(this.db, 'inventories', userId, 'items');
  }

  private docToInventoryItem(doc: DocumentSnapshot<DocumentData>): InventoryItem {
    return { ...doc.data(), id: doc.id } as InventoryItem;
  }

  private docsToInventoryItems(docs: QuerySnapshot<DocumentData>): InventoryItem[] {
    return docs.docs.map(doc => this.docToInventoryItem(doc));
  }
}
