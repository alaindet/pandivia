import { Component, EventEmitter, Input, Output, SimpleChanges, ViewChild, ViewEncapsulation } from '@angular/core';
import { NgIf, NgTemplateOutlet } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

import { ACTIONS_MENU_EXPORTS, ActionsMenuItem, BottomMenuComponent, BottomMenuItem, ButtonComponent, PageHeaderComponent, TextInputComponent } from '@app/common/components';
import { Counters } from '../../types';
import { TranslocoModule } from '@ngneat/transloco';
import { didInputChange } from '../../utils';

const imports = [
  NgIf,
  NgTemplateOutlet,
  ...ACTIONS_MENU_EXPORTS,
  PageHeaderComponent,
  ButtonComponent,
  BottomMenuComponent,
  MatIconModule,
  TextInputComponent,
  TranslocoModule,
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

  @Input({ required: true }) title!: string;
  @Input({ required: true }) headerActions!: ActionsMenuItem[];
  @Input() headerCounters: Counters | null = null;
  @Input({ required: true }) footerActions!: BottomMenuItem[];
  @Input() footerCurrentAction: string | null = null;
  @Input() withBackButton = false;
  @Input() withControlledBackButton = false;
  @Input() withSearch = false;
  @Input() withVisibleSearch = false;
  @Input() searchQuery = '';

  @Output() headerActionClicked = new EventEmitter<string>();
  @Output() footerActionClicked = new EventEmitter<string>();
  @Output() backButtonClicked = new EventEmitter<void>();
  @Output() toggledSearch = new EventEmitter<void>();
  @Output() searched = new EventEmitter<string>();
  @Output() searchCleared = new EventEmitter<void>();

  @ViewChild('inputRef', { read: TextInputComponent })
  set inputRefSetter(ref: TextInputComponent) {
    this.inputRef = ref;
  }
  inputRef?: TextInputComponent;

  ngOnChanges(changes: SimpleChanges) {
    if (didInputChange(changes['withVisibleSearch']) && this.withVisibleSearch) {
      queueMicrotask(() => this.inputRef?.focus());
    }
  }

  onHeaderAction(action: string) {
    this.headerActionClicked.emit(action);
  }

  onBottomMenuChange(action: string) {
    this.footerActionClicked.emit(action);
  }

  onToggleSearchBar() {
    this.toggledSearch.emit();
  }
}
