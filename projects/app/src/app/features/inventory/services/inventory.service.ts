import { Injectable } from '@angular/core';
import { Observable, catchError, of, throwError } from 'rxjs';

import { CreateInventoryItemDto, InventoryItem } from '@app/core';
import { FakeRequestConfig, MOCK_DELAY, MOCK_FAIL_RATE, MOCK_INVENTORY_ITEMS, fakeRequest } from '@app/mocks';
import { getRandomHash } from '@app/common/utils';

// This service is mocked for now
// This service holds data and reverts it in case of failed requests
// TODO: Split this into multiple sub-services or controllers
@Injectable({
  providedIn: 'root',
})
export class InventoryService {

  private items: InventoryItem[] = MOCK_INVENTORY_ITEMS;

  private config: FakeRequestConfig = {
    failRate: MOCK_FAIL_RATE,
    delay: MOCK_DELAY,
  };

  getItems(): Observable<InventoryItem[]> {
    return fakeRequest(this.items, this.config);
  }

  createItem(dto: CreateInventoryItemDto): Observable<InventoryItem> {
    return this.revertableFakeRequest(() => {
      const id = getRandomHash(5);
      const item = { ...dto, id, isDone: false };
      this.items = [item, ...this.items];
      return item;
    });
  }

  editItem(editedItem: InventoryItem): Observable<InventoryItem> {
    const id = editedItem.id;
    return this.revertableFakeRequest(() => editedItem);
  }

  removeItem(itemId: InventoryItem['id']): Observable<InventoryItem> {
    return this.revertableFakeRequest(() => {
      const item = this.items.find(item => item.id === itemId)!;
      this.items = this.items.filter(item => itemId !== item.id);
      return item;
    });
  }

  removeByCategory(category: string): Observable<InventoryItem[]> {
    return this.revertableFakeRequest(() => {
      this.items = this.items.filter(item => item.category !== category);
      return this.items;
    });
  }

  removeAll(): Observable<InventoryItem[]> {
    return this.revertableFakeRequest(() => {
      this.items = [];
      return this.items;
    });
  }

  private revertableFakeRequest<T = InventoryItem | InventoryItem[]>(
    fn: () => T,
  ): Observable<T> {
    const backupItems = structuredClone(this.items);
    const onRevert = () => this.items = backupItems;
    const payload = fn();
    return fakeRequest(payload, this.config).pipe(catchError(err => {
      onRevert();
      return throwError(() => of(err));
    }));
  }

  private updateItem(
    itemId: InventoryItem['id'],
    fn: ((item: InventoryItem) => InventoryItem),
  ): InventoryItem {
    const oldItem = this.items.find(item => item.id === itemId)!;
    const newItem = fn(oldItem);
    this.items = this.items.map(item => {
      if (item.id !== itemId) return item;
      return newItem;
    });
    return newItem;
  }
}
