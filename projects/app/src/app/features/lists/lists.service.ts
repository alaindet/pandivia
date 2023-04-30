import { Injectable, OnDestroy } from '@angular/core';

import { DataSource, OnceSource } from '@app/common/sources';
import { List } from './types';

@Injectable({
  providedIn: 'root',
})
export class ListsService implements OnDestroy {

  private once = new OnceSource();

  lists$ = new DataSource<List[] | null>(null, this.once.event$);

  ngOnDestroy() {
    this.once.trigger();
  }
}
