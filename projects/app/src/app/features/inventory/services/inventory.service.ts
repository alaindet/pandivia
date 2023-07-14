import { Injectable, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, from } from 'rxjs';
import { CollectionReference, DocumentData, Firestore, addDoc, collection, deleteDoc, doc, getDoc, getDocs, orderBy, query, updateDoc, where, writeBatch } from '@angular/fire/firestore';

import { selectUserId } from '@app/features/user/store';
import { CreateInventoryItemDto, InventoryItem } from '../types';
import { docToInventoryItem, docsToInventoryItems } from './utils';
import { DEFAULT_CATEGORY } from '@app/core/constants';

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
      return docsToInventoryItems(docs);
    })());
  }

  createItem(dto: CreateInventoryItemDto): Observable<InventoryItem> {
    return from((async () => {
      const itemsRef = this.getItemsRef();
      const itemData = {
        ...dto,
        category: dto?.category || DEFAULT_CATEGORY,
        description: dto?.description || '',
      };
      const itemRef = await addDoc(itemsRef, itemData);
      const itemDoc = await getDoc(itemRef);
      return docToInventoryItem(itemDoc);
    })());
  }

  editItem(editedItem: InventoryItem): Observable<InventoryItem> {
    return from((async () => {
      const userId = this.userId()!;
      const itemId = editedItem.id;
      const itemRef = doc(this.db, 'inventories', userId, 'items', itemId);
      const { id: _, ...dto } = editedItem;
      dto.category = dto?.category || DEFAULT_CATEGORY;
      dto.description = dto?.description || '';
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
      return docToInventoryItem(itemDoc);
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
}
