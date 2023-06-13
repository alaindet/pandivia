import { Injectable } from '@angular/core';
import { Observable, catchError, of, tap, throwError } from 'rxjs';

import { FakeRequestConfig, MOCK_DELAY, MOCK_FAIL_RATE, MOCK_LIST_ITEMS, fakeRequest } from '@app/mocks';
import { getRandomHash } from '@app/common/utils';
import { CreateListItemDto, ListItem } from '../types';

// This service is mocked for now
// This service holds data and reverts it in case of failed requests
// TODO: Split this into multiple sub-services or controllers
@Injectable({
  providedIn: 'root',
})
export class ListService {

  private items: ListItem[] = MOCK_LIST_ITEMS;

  private config: FakeRequestConfig = {
    failRate: MOCK_FAIL_RATE,
    delay: MOCK_DELAY,
  };

  getItems(): Observable<ListItem[]> {
    return fakeRequest(this.items, this.config);
  }

  createItem(dto: CreateListItemDto): Observable<ListItem> {
    return this.revertableFakeRequest(() => {
      const id = getRandomHash(5);
      const item = { ...dto, id, isDone: false };
      this.items = [item, ...this.items];
      return item;
    });
  }

  editItem(editedItem: ListItem): Observable<ListItem> {
    const id = editedItem.id;
    return this.revertableFakeRequest(() => editedItem);
  }

  completeItem(itemId: ListItem['id']): Observable<ListItem> {
    return this.revertableFakeRequest(() => {
      return this.updateItem(itemId, item => ({ ...item, isDone: true }));
    });
  }

  undoItem(itemId: ListItem['id']): Observable<ListItem> {
    return this.revertableFakeRequest(() => {
      return this.updateItem(itemId, item => ({ ...item, isDone: false }));
    });
  }

  toggleItem(itemId: ListItem['id']): Observable<ListItem> {
    return this.revertableFakeRequest(() => {
      return this.updateItem(itemId, item => ({ ...item, isDone: !item.isDone }));
    });
  }

  incrementItem(itemId: ListItem['id']): Observable<ListItem> {
    return this.revertableFakeRequest(() => {
      return this.updateItem(itemId, item => ({ ...item, amount: item.amount + 1 }));
    });
  }

  decrementItem(itemId: ListItem['id']): Observable<ListItem> {
    // TODO: Remove on amount === 0?
    return this.revertableFakeRequest(() => {
      return this.updateItem(itemId, item => ({ ...item, amount: item.amount - 1 }));
    });
  }

  removeItem(itemId: ListItem['id']): Observable<ListItem> {
    return this.revertableFakeRequest(() => {
      const item = this.items.find(item => item.id === itemId)!;
      this.items = this.items.filter(item => itemId !== item.id);
      return item;
    });
  }

  completeItemsByCategory(category: string): Observable<ListItem[]> {
    return this.revertableFakeRequest(() => {
      this.items = this.items.map(item => {
        if (item.category !== category) return item;
        return { ...item, isDone: true };
      });
      return this.items;
    });
  }

  undoItemsByCategory(category: string): Observable<ListItem[]> {
    return this.revertableFakeRequest(() => {
      this.items = this.items.map(item => {
        if (item.category !== category) return item;
        return { ...item, isDone: false };
      });
      return this.items;
    });
  }

  removeCompletedByCategory(category: string): Observable<ListItem[]> {
    return this.revertableFakeRequest(() => {
      this.items = this.items.filter(item => {
        if (item.category !== category) return true;
        return !item.isDone;
      });
      return this.items;
    });
  }

  removeByCategory(category: string): Observable<ListItem[]> {
    return this.revertableFakeRequest(() => {
      this.items = this.items.filter(item => item.category !== category);
      return this.items;
    });
  }

  removeAllCompleted(): Observable<ListItem[]> {
    return this.revertableFakeRequest(() => {
      this.items = this.items.filter(item => !item.isDone);
      return this.items;
    });
  }

  completeAllItems(): Observable<ListItem[]> {
    return this.revertableFakeRequest(() => {
      this.items = this.items.map(item => ({ ...item, isDone: true }));
      return this.items;
    });
  }

  undoAllItems(): Observable<ListItem[]> {
    return this.revertableFakeRequest(() => {
      this.items = this.items.map(item => ({ ...item, isDone: false }));
      return this.items;
    });
  }

  removeAll(): Observable<ListItem[]> {
    return this.revertableFakeRequest(() => {
      this.items = [];
      return this.items;
    });
  }

  private revertableFakeRequest<T = ListItem | ListItem[]>(
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
    itemId: ListItem['id'],
    fn: ((item: ListItem) => ListItem),
  ): ListItem {
    const oldItem = this.items.find(item => item.id === itemId)!;
    const newItem = fn(oldItem);
    this.items = this.items.map(item => {
      if (item.id !== itemId) return item;
      return newItem;
    });
    return newItem;
  }
}
