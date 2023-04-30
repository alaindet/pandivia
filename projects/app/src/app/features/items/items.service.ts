import { Injectable, OnDestroy } from '@angular/core';

import { DataSource, OnceSource } from '@app/common/sources';
import { ListItem } from './types';

@Injectable({
  providedIn: 'root',
})
export class ItemsService implements OnDestroy {

  private once = new OnceSource();

  items$ = new DataSource<ListItem[] | null>(null, this.once.event$);

  ngOnDestroy() {
    this.once.trigger();
  }
}
