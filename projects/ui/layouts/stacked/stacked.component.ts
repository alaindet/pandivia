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
import { matMoreHoriz, matSearch } from '@ng-icons/material-icons/baseline';
import {
  ActionsMenuButtonDirective,
  ActionsMenuComponent,
  ActionsMenuItem,
  BottomMenuComponent,
  BottomMenuItem,
  IconButtonComponent,
  PageHeaderComponent,
  TextInputComponent,
} from '@ui/components';
import { Counters } from '@common/types';
import { TranslocoModule } from '@jsverse/transloco';

@Component({
  selector: 'app-layout-stacked',
  imports: [
    NgTemplateOutlet,
    NgIcon,
    ActionsMenuComponent,
    ActionsMenuButtonDirective,
    BottomMenuComponent,
    PageHeaderComponent,
    IconButtonComponent,
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
  i18nGoToPreviousPage = input('Go to previous page');
  i18nToggleSearchBar = input('Toggle search bar');
  i18nToggleActionsMenu = input('Toggle actions menu');

  headerActionClicked = output<string>();
  footerActionClicked = output<string>();
  toggledSearch = output<void>();
  searched = output<string>();
  searchCleared = output<void>();

  inputRef = viewChild.required('inputRef', { read: TextInputComponent });

  visibleSearchEffect = effect(() => {
    if (this.withVisibleSearch()) {
      // TODO: use afterNextRender()
      queueMicrotask(() => this.inputRef()?.focus());
    }
  });

  icon = { matMoreHoriz, matSearch };

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
