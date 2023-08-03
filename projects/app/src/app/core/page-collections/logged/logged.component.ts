import { Component, computed, inject } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { AsyncPipe, NgIf } from '@angular/common';
import { Store } from '@ngrx/store';
import { TranslocoService } from '@ngneat/transloco';

import { BottomMenuItem } from '@app/common/components';
import { BACK_BUTTON_STATUS } from '@app/common/types';
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

  layout = inject(StackedLayoutService);
  private router = inject(Router);
  private store = inject(Store);
  private transloco = inject(TranslocoService);

  BACK_BUTTON_STATUS = BACK_BUTTON_STATUS;

  vm = computed(() => ({
    layout: this.layout.vm(),
    nav: this.getTranslatedNavItems()(),
  }));

  onBottomNavigation(actionId: BottomMenuItem['id']) {
    this.router.navigate([NAVIGATION_ROUTES[actionId]]);
  }

  private getTranslatedNavItems() {
    const nav = this.store.selectSignal(selectNavigation);
    return computed(() => ({
      ...nav(),
      items: nav().items.map(item => {
        const label = this.transloco.translate(item.label);
        return { ...item, label };
      }),
    }));
  }
}
