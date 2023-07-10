import { Injectable, inject } from '@angular/core';
import { Observable, from } from 'rxjs';
import { Store } from '@ngrx/store';
import { Firestore, addDoc, collection, getDoc } from '@angular/fire/firestore';

import { selectUserId } from '@app/features/user/store';
import { CreateInventoryItemDto, InventoryItem } from '../types';

@Injectable({
  providedIn: 'root',
})
export class InventoryService {

  private db = inject(Firestore);
  private store = inject(Store);
  private userId = this.store.selectSignal(selectUserId);

  createItem(dto: CreateInventoryItemDto): Observable<InventoryItem> {

    if (!this.userId()) {
      throw new Error('No user ID');
    }

    return from((async () => {
      const userId = this.userId()!;
      const itemsRef = collection(this.db, 'inventories', userId, 'items');
      const itemRef = await addDoc(itemsRef, dto);
      const itemDoc = await getDoc(itemRef);
      const item = { ...itemDoc.data(), id: itemRef.id } as InventoryItem;
      return item;
    })());
  }
}
