import { AsyncPipe, NgFor, NgIf } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { Store } from '@ngrx/store';

import { StackedLayoutService } from '@app/common/layouts';
import { NAVIGATION_ITEM_LIST } from '@app/core/constants/navigation';
import { setCurrentNavigation, setCurrentTitle } from '@app/core/store';
import { ITEM_CONTEXTUAL_MENU } from './item-contextual-menu';
import { LIST_CONTEXTUAL_MENU, LIST_REFRESH_ACTION } from './list-contextual-menu';
import { fetchListItemsActions, selectListCategorizedItems } from './store';

const IMPORTS = [
  NgIf,
  NgFor,
  AsyncPipe,
];

@Component({
  selector: 'app-list-page',
  standalone: true,
  imports: IMPORTS,
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
})
export class ListPageComponent implements OnInit {

  private store = inject(Store);
  private layout = inject(StackedLayoutService);

  items$ = this.store.select(selectListCategorizedItems);
  listContextualMenu = LIST_CONTEXTUAL_MENU;
  itemContextualMenu = ITEM_CONTEXTUAL_MENU;

  ngOnInit() {
    this.initPageMetadata();
    this.layout.setHeaderActions(LIST_CONTEXTUAL_MENU);
    this.store.dispatch(fetchListItemsActions.fetchItems());
    this.layout.headerActionEvent.subscribe(this.onListContextualAction.bind(this));
  }

  onListContextualAction(action: string) {
    switch (action) {
      case LIST_REFRESH_ACTION.id:
        this.store.dispatch(fetchListItemsActions.forceFetchItems());
        break;
    }
  }

  onItemClick(itemId: string) {
    console.log('onItemClick', itemId);
  }

  private initPageMetadata(): void {
    this.layout.setTitle('List');
    this.store.dispatch(setCurrentTitle({ title: 'List - Pandivia' }));
    this.store.dispatch(setCurrentNavigation({ current: NAVIGATION_ITEM_LIST.id }));
  }
}
