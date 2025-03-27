import { NgTemplateOutlet } from '@angular/common';
import {
  Component,
  ViewEncapsulation,
  booleanAttribute,
  effect,
  input,
  output,
  viewChild,
} from '@angular/core';
import { NgIcon } from '@ng-icons/core';
import { matSearch, matMoreHoriz } from '@ng-icons/material-icons/baseline';
import { IconButtonComponent } from '@ui/components/icon-button';

import {
  ACTIONS_MENU_EXPORTS,
  ActionsMenuItem,
  BottomMenuComponent,
  BottomMenuItem,
  PageHeaderComponent,
  TextInputComponent,
} from '@app/common/components';
import { TranslocoModule } from '@jsverse/transloco';
import { Counters } from '@common/types';

@Component({
  selector: 'app-layout-stacked',
  imports: [
    NgTemplateOutlet,
    NgIcon,
    ...ACTIONS_MENU_EXPORTS,
    PageHeaderComponent,
    IconButtonComponent,
    BottomMenuComponent,
    TextInputComponent,
    TranslocoModule,
  ],
  templateUrl: './stacked.component.html',
  styleUrl: './stacked.component.css',
  host: { class: 'app-layout-stacked' },
  encapsulation: ViewEncapsulation.None,
})
export class StackedLayoutComponent {
  title = input.required<string>();
  headerActions = input.required<ActionsMenuItem[]>();
  headerCounters = input<Counters | null>(null);
  footerActions = input.required<BottomMenuItem[]>();
  footerCurrentAction = input<string | null>(null);
  withSearch = input(false, { transform: booleanAttribute });
  withVisibleSearch = input(false, { transform: booleanAttribute });
  searchQuery = input('');
  searchBarButtonLabel = input('Toggle search bar');
  actionsToggleLabel = input('Toggle actions menu');

  headerActionClicked = output<string>();
  footerActionClicked = output<string>();
  toggledSearch = output<void>();
  searched = output<string>();
  searchCleared = output<void>();

  inputRef = viewChild.required('inputRef', { read: TextInputComponent });

  visibleSearchEffect = effect(() => {
    if (this.withVisibleSearch()) {
      queueMicrotask(() => this.inputRef()?.focus());
    }
  });

  matSearch = matSearch;
  matMoreHoriz = matMoreHoriz;

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
