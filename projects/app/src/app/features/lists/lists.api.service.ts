import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

import { removeAt, replaceAt } from '@app/common/utils';
import { List } from './types';

@Injectable({
  providedIn: 'root',
})
export class ListsApiService {

  private STORAGE_KEY = 'pandivia.lists';

  createList(name: List['name']): Observable<List | null> {
    const id = this.createFakeId(name);
    const list = { id, name };
    let lists = this.fetchFromStorage();
    const existing = lists.find(l => l.name === list.name);
    if (existing) return of(null);
    lists = [...lists, list];
    this.persistOnStorage(lists);
    return of(list);
  }

  readLists(): Observable<List[]> {
    return of(this.fetchFromStorage());
  }

  readList(id: List['id']): Observable<List | null> {
    const lists = this.fetchFromStorage();
    return of(lists.find(list => list.id === id) ?? null);
  }

  updateList(list: List): Observable<List | null> {
    let lists = this.fetchFromStorage();
    const index = lists.findIndex(l => l.id === list.id);
    if (index === -1) return of(null);
    lists = replaceAt(lists, index, list);
    this.persistOnStorage(lists);
    return of(list);
  }

  deleteList(list: List): Observable<List | null> {
    let lists = this.fetchFromStorage();
    const index = lists.findIndex(l => l.id === list.id);
    if (index === -1) return of(null);
    lists = removeAt(lists, index);
    this.persistOnStorage(lists);
    return of(list);
  }

  deleteAllLists(): Observable<boolean> {
    this.clearStorage();
    return of(true);
  }

  private fetchFromStorage(): List[] {
    const data = window.localStorage.getItem(this.STORAGE_KEY);
    if (!data) return [];
    return JSON.parse(data) as List[];
  }

  private persistOnStorage(lists: List[]): void {
    const data = JSON.stringify(lists);
    window.localStorage.setItem(this.STORAGE_KEY, data);
  }

  private clearStorage(): void {
    window.localStorage.removeItem(this.STORAGE_KEY);
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
