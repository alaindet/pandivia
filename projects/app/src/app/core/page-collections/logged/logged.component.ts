import { Component, computed, inject } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { TranslocoService } from '@jsverse/transloco';
import { BottomMenuItem } from '@ui/components';

import {
  StackedLayoutComponent,
  StackedLayoutService,
} from '@app/common/layouts';
import { NAVIGATION_ROUTES, UiStore } from '@app/core/ui';

@Component({
  selector: 'app-logged-page-collection',
  imports: [RouterOutlet, StackedLayoutComponent],
  templateUrl: './logged.component.html',
})
export class LoggedPageCollectionComponent {
  private layout = inject(StackedLayoutService);
  private router = inject(Router);
  private uiStore = inject(UiStore);
  private transloco = inject(TranslocoService);

  private bottomNavigation = computed(() =>
    this.computeBottomNavigationItems()
  );
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
    const nav = this.uiStore.navigation.navigation();

    return {
      ...nav,
      items: nav.items.map((item) => {
        const label = this.transloco.translate(item.label);
        return { ...item, label };
      }),
    };
  }
}
