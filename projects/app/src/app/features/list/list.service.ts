import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { CreateListItemDto, ListItem } from '@app/core';
import { FakeRequestConfig, MOCK_DELAY, MOCK_FAIL_RATE, MOCK_LIST_ITEMS, fakeRequest } from '@app/mocks';
import { getRandomHash } from '@app/common/utils';

// This service is mocked for now
@Injectable({
  providedIn: 'root',
})
export class ListService {

  private items: ListItem[] = [];

  private config: FakeRequestConfig = {
    failRate: MOCK_FAIL_RATE,
    delay: MOCK_DELAY,
  };

  constructor() {
    this.items = MOCK_LIST_ITEMS;
  }

  getItems(): Observable<ListItem[]> {
    return fakeRequest(this.items, this.config);
  }

  createItem(dto: CreateListItemDto): Observable<ListItem> {
    const id = getRandomHash(5);
    const item = { ...dto, id, isDone: false };
    this.items = [item, ...this.items];
    return fakeRequest(item, this.config);
  }

  editItem(editedItem: ListItem): Observable<ListItem> {
    const id = editedItem.id;
    return this.updateItem(id, () => editedItem);
  }

  completeItem(itemId: ListItem['id']): Observable<ListItem> {
    return this.updateItem(itemId, item => ({ ...item, isDone: true }));
  }

  undoItem(itemId: ListItem['id']): Observable<ListItem> {
    return this.updateItem(itemId, item => ({ ...item, isDone: false }));
  }

  toggleItem(itemId: ListItem['id']): Observable<ListItem> {
    return this.updateItem(itemId, item => ({ ...item, isDone: !item.isDone }));
  }

  incrementItem(itemId: ListItem['id']): Observable<ListItem> {
    return this.updateItem(itemId, item => ({ ...item, amount: item.amount + 1}));
  }

  decrementItem(itemId: ListItem['id']): Observable<ListItem> {
    // TODO: Remove on amount === 0?
    return this.updateItem(itemId, item => ({ ...item, amount: item.amount - 1}));
  }

  removeItem(itemId: ListItem['id']): Observable<ListItem> {
    const item = this.items.find(item => item.id === itemId)!;
    this.items = this.items.filter(item => itemId !== item.id);
    return fakeRequest(item, this.config);
  }

  completeAllItems(): Observable<ListItem[]> {
    this.items = this.items.map(item => ({ ...item, isDone: true }));
    return fakeRequest(this.items, this.config);
  }

  undoAllItems(): Observable<ListItem[]> {
    this.items = this.items.map(item => ({ ...item, isDone: false }));
    return fakeRequest(this.items, this.config);
  }

  completeItemsByCategory(category: string): Observable<ListItem[]> {
    this.items = this.items.map(item => {
      return (item.category === category)
        ? { ...item, isDone: true }
        : item;
    });
    return fakeRequest(this.items, this.config);
  }

  undoItemsByCategory(category: string): Observable<ListItem[]> {
    this.items = this.items.map(item => {
      return (item.category === category)
        ? { ...item, isDone: false }
        : item;
    });
    return fakeRequest(this.items, this.config);
  }

  private updateItem(
    itemId: ListItem['id'],
    fn: ((item: ListItem) => ListItem),
  ): Observable<ListItem> {
    const oldItem = this.items.find(item => item.id === itemId)!;
    const newItem = fn(oldItem);
    this.items = this.items.map(item => (itemId === item.id) ? newItem : item);
    return fakeRequest(newItem, this.config);
  }
}
