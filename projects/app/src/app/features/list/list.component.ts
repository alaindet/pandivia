import { Component, OnInit, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

import { ActionsMenuButtonDirective, ActionsMenuComponent, ActionsMenuItemDirective, ButtonComponent, PageHeaderComponent } from '@app/common/components';
import { LIST_CONTEXTUAL_MENU } from './contextual-menu';
import { ListService } from './list.service';

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

  private listService = inject(ListService);

  items: any[] = [];
  contextualMenu = LIST_CONTEXTUAL_MENU;

  ngOnInit() {
    this.listService.getItems().subscribe(items => {
      this.items = items;
      console.log('items', items);
    });
  }

  onListContextualAction(action: string) {
    console.log('onListContextualAction', action);
  }
}
