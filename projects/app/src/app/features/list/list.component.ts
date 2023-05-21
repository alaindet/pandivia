import { Component, OnInit, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { Store, provideState } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';

import { ActionsMenuButtonDirective, ActionsMenuComponent, ActionsMenuItemDirective, ButtonComponent, PageHeaderComponent } from '@app/common/components';
import { LIST_CONTEXTUAL_MENU } from './contextual-menu';
import { LIST_FEATURE_EFFECTS, LIST_FEATURE_NAME, fetchItemsActions, listReducer } from './store';

const IMPORTS = [
  PageHeaderComponent,
  ActionsMenuComponent,
  ActionsMenuButtonDirective,
  ActionsMenuItemDirective,
  MatIconModule,
  ButtonComponent,
];

@Component({
  selector: 'app-list-feature',
  standalone: true,
  imports: IMPORTS,
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
  providers: [
    provideState(LIST_FEATURE_NAME, listReducer),
    provideEffects(...LIST_FEATURE_EFFECTS),
  ],
})
export class ListFeatureComponent implements OnInit {

  private store = inject(Store);

  contextualMenu = LIST_CONTEXTUAL_MENU;

  ngOnInit() {
    this.store.dispatch(fetchItemsActions.fetchItems());
  }

  onListContextualAction(action: string) {
    console.log('onListContextualAction', action);
  }
}
