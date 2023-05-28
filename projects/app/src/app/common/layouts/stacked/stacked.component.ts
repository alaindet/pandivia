import { Component, EventEmitter, Input, Output, ViewEncapsulation, inject } from '@angular/core';

import { ActionsMenuButtonDirective, ActionsMenuComponent, ActionsMenuItem, BottomMenuComponent, BottomMenuItem, ButtonComponent, PageHeaderComponent } from '@app/common/components';
import { StackedLayoutService } from './stacked.service';
import { MatIconModule } from '@angular/material/icon';

const IMPORTS = [
  ActionsMenuComponent,
  ActionsMenuButtonDirective,
  PageHeaderComponent,
  ButtonComponent,
  BottomMenuComponent,
  MatIconModule,
];

@Component({
  selector: 'app-layout-stacked',
  standalone: true,
  imports: IMPORTS,
  templateUrl: './stacked.component.html',
  styleUrls: ['./stacked.component.scss'],
  // providers: [StackedLayoutService],
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