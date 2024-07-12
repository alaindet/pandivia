import { Component, computed, inject } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { AsyncPipe, NgIf } from '@angular/common';
import { Store } from '@ngrx/store';
import { TranslocoService } from '@jsverse/transloco';

import { BottomMenuItem } from '@app/common/components';
import { BACK_BUTTON_MODE } from '@app/common/types';
import { StackedLayoutComponent, StackedLayoutService } from '@app/common/layouts';
import { NAVIGATION_ROUTES } from '../../ui';
import { selectNavigation } from '../../store';

const imports = [
  NgIf,
  AsyncPipe,
  RouterOutlet,
  StackedLayoutComponent,
];

@Component({
  selector: 'app-logged-page-collection',
  standalone: true,
  imports,
  templateUrl: './logged.component.html',
  providers: [StackedLayoutService], // <-- Mind this
})
export class LoggedPageCollectionComponent {

  private layout = inject(StackedLayoutService);
  private router = inject(Router);
  private store = inject(Store);
  private transloco = inject(TranslocoService);

  private bottomNavigation = computed(() => this.computeBottomNavigationItems());
  bottomNavigationItems = computed(() => this.bottomNavigation().items);
  bottomNavigationCurrent = computed(() => this.bottomNavigation().current);
  search = this.layout.search;
  title = this.layout.title.title;
  headerActions = this.layout.headerActions.actions;
  headerCounters = this.layout.headerCounters.counters;
  searchEnabled = this.layout.search.enabled;
  searchVisible = this.layout.search.visible;
  searchQuery = this.layout.search.query;

  onBottomNavigation(actionId: BottomMenuItem['id']) {
    this.router.navigate([NAVIGATION_ROUTES[actionId]]);
  }

  onHeaderActionClicked(action: string) {
    this.layout.headerActions.confirm(action);
  }

  onTypeSearchQuery(query: string) {
    this.layout.search.search(query);
  }

  onClearSearchQuery() {
    this.layout.search.clear();
  }

  onToggleSearchBox() {
    this.layout.search.toggle();
  }

  private computeBottomNavigationItems() {

    const nav = this.store.selectSignal(selectNavigation);

    return {
      ...nav(),
      items: nav().items.map(item => {
        const label = this.transloco.translate(item.label);
        return { ...item, label };
      }),
    };
  }
}
