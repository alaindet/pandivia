import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

import { removeAt, replaceAt } from '@app/common/utils';
import { CreateListItemRequest, DeleteListItemRequest, ListItem, UpdateListItemRequest } from './types';

@Injectable({
  providedIn: 'root',
})
export class ListItemsApiService {

  private STORAGE_KEY = 'pandivia.items';

  createItem(request: CreateListItemRequest): Observable<ListItem | null> {
    const id = this.createFakeId(request.name);
    const item = { ...request, id, isDone: false };
    let items = this.fetchFromStorage(request.listId);
    const existing = items.find(it => it.name === request.name);
    if (existing) return of(null);
    items = [...items, item];
    this.persistOnStorage(request.listId, items);
    return of(item);
  }

  updateItem(request: UpdateListItemRequest): Observable<ListItem | null> {
    const item = { ...request };
    let items = this.fetchFromStorage(request.listId);
    const index = items.findIndex(i => i.id === item.id);
    if (index === -1) return of(null);
    items = replaceAt(items, index, item);
    this.persistOnStorage(request.listId, items);
    return of(item);
  }

  deleteItem(request: DeleteListItemRequest): Observable<ListItem | null> {
    const { id, listId } = request;
    let items = this.fetchFromStorage(listId);
    const index = items.findIndex(it => it.id === id);
    if (index === -1) return of(null);
    items = removeAt(items, index);
    this.persistOnStorage(listId, items);
    return of(items[index]);
  }

  readItems(listId: string): Observable<ListItem[]> {
    return of(this.fetchFromStorage(listId));
  }

  readItem(listId: string, id: string): Observable<ListItem | null> {
    const items = this.fetchFromStorage(listId);
    return of(items.find(it => it.id === id) ?? null);
  }

  deleteAllItems(listId: string): Observable<boolean> {
    const key = `${this.STORAGE_KEY}.${listId}`;
    window.localStorage.removeItem(key);
    return of(true);
  }

  private fetchFromStorage(listId: ListItem['listId']): ListItem[] {
    const key = `${this.STORAGE_KEY}.${listId}`;
    const data = window.localStorage.getItem(key);
    if (!data) return [];
    return JSON.parse(data) as ListItem[];
  }

  private persistOnStorage(listId: string, items: ListItem[]): void {
    const key = `${this.STORAGE_KEY}.${listId}`;
    const data = JSON.stringify(items);
    window.localStorage.setItem(key, data);
  }

  private clearStorage(listId: string): void {
    const key = `${this.STORAGE_KEY}.${listId}`;
    window.localStorage.removeItem(key);
  }

  private createFakeId(seed: string): string {
    const now = Date.now().toString();
    const len = Math.min(now.length, seed.length);
    let id = '';

    for (let i = 0; i < len; i++) {
      const bit = i % 2 ? now[i] : seed[i];
      id += bit;
    }

    return id;
  }
}
