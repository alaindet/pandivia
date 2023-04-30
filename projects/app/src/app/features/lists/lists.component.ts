import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Store } from '@ngrx/store';
import { MatIconModule } from '@angular/material/icon';

import { createListActions, selectLists, selectListsLoaded } from './store';

const IMPORTS = [
  CommonModule,
  RouterModule,
  MatIconModule,
];

@Component({
  selector: 'app-lists',
  standalone: true,
  imports: IMPORTS,
  templateUrl: './lists.component.html',
  styleUrls: ['./lists.component.scss'],
})
export class ListsPageComponent {
  store = inject(Store);

  loaded$ = this.store.select(selectListsLoaded);
  lists$ = this.store.select(selectLists);

  ngOnInit() {
    this.lists$.subscribe(lists => console.log('lists from store', lists));
  }

  addItem() {
    const list = { id: 'four', name: 'Four' };
    this.store.dispatch(createListActions.successfullyCreated({ list }));
  }
}
