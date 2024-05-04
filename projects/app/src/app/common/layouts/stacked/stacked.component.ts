import { NgTemplateOutlet } from '@angular/common';
import { Component, ViewEncapsulation, effect, input, output, viewChild } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

import { ACTIONS_MENU_EXPORTS, ActionsMenuItem, BottomMenuComponent, BottomMenuItem, ButtonComponent, PageHeaderComponent, TextInputComponent } from '@app/common/components';
import { TranslocoModule } from '@ngneat/transloco';
import { Counters } from '../../types';

const imports = [
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
  styleUrl: './stacked.component.scss',
  host: { class: 'app-layout-stacked' },
  encapsulation: ViewEncapsulation.None,
})
export class StackedLayoutComponent {

  title = input.required<string>();
  headerActions = input.required<ActionsMenuItem[]>();
  headerCounters = input<Counters | null>(null);
  footerActions = input.required<BottomMenuItem[]>();
  footerCurrentAction = input<string | null>(null);
  withBackButton = input(false);
  withControlledBackButton = input(false);
  withSearch = input(false);
  withVisibleSearch = input(false);
  searchQuery = input('');

  headerActionClicked = output<string>();
  footerActionClicked = output<string>();
  backButtonClicked = output<void>();
  toggledSearch = output<void>();
  searched = output<string>();
  searchCleared = output<void>();

  inputRef = viewChild.required('inputRef', { read: TextInputComponent });

  onVisibleSearchChange$ = effect(() => {
    if (this.withVisibleSearch()) {
      queueMicrotask(() => this.inputRef()?.focus());
    }
  });

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
