import { Component, OnInit, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

import { ActionsMenuButtonDirective, ActionsMenuComponent, ActionsMenuItemDirective, ButtonComponent, PageHeaderComponent } from '@app/common/components';
import { LIST_CONTEXTUAL_MENU } from './contextual-menu';
import { ListService } from './list.service';
import { Store } from '@ngrx/store';

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
})
export class ListFeatureComponent implements OnInit {

  private store = inject(Store);

  contextualMenu = LIST_CONTEXTUAL_MENU;

  ngOnInit() {
    this.store.dispatch();
  }

  onListContextualAction(action: string) {
    console.log('onListContextualAction', action);
  }
}
