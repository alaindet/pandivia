import { Component, EventEmitter, Input, Output, ViewEncapsulation, inject } from '@angular/core';

import { ACTIONS_MENU_EXPORTS, ActionsMenuItem, BottomMenuComponent, BottomMenuItem, ButtonComponent, PageHeaderComponent } from '@app/common/components';
import { StackedLayoutService } from './stacked.service';
import { MatIconModule } from '@angular/material/icon';
import { NgIf } from '@angular/common';

const imports = [
  NgIf,
  ...ACTIONS_MENU_EXPORTS,
  PageHeaderComponent,
  ButtonComponent,
  BottomMenuComponent,
  MatIconModule,
];

@Component({
  selector: 'app-layout-stacked',
  standalone: true,
  imports,
  templateUrl: './stacked.component.html',
  styleUrls: ['./stacked.component.scss'],
  encapsulation: ViewEncapsulation.None,
  host: { class: 'app-layout-stacked' },
})
export class StackedLayoutComponent {

  svc = inject(StackedLayoutService);

  @Input({ required: true }) title!: string;
  @Input({ required: true }) headerActions!: ActionsMenuItem[];
  @Input({ required: true }) footerActions!: BottomMenuItem[];
  @Input() footerCurrentAction: string | null = null;
  @Input() withBackButton = false;
  @Input() withControlledBackButton = false;

  @Output() headerActionClicked = new EventEmitter<string>();
  @Output() footerActionClicked = new EventEmitter<string>();
  @Output() backButtonClicked = new EventEmitter<void>();

  onHeaderAction(action: string) {
    this.headerActionClicked.emit(action);
  }

  onBottomMenuChange(action: string) {
    this.footerActionClicked.emit(action);
  }
}
