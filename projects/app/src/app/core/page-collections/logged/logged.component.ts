import { Component, inject } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { AsyncPipe, NgIf } from '@angular/common';
import { combineLatest, debounceTime } from 'rxjs';
import { Store } from '@ngrx/store';

import { BottomMenuItem } from '@app/common/components';
import { BACK_BUTTON_STATUS } from '@app/common/types';
import { StackedLayoutComponent, StackedLayoutService } from '@app/common/layouts';
import { NAVIGATION_ROUTES } from '../../navigation';
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
  providers: [StackedLayoutService],
})
export class LoggedPageCollectionComponent {

  layout = inject(StackedLayoutService);
  private router = inject(Router);
  private store = inject(Store);

  BACK_BUTTON_STATUS = BACK_BUTTON_STATUS;
  vm$ = combineLatest({
    layout: this.layout.vm,
    nav: this.store.select(selectNavigation),
  }).pipe(debounceTime(1000 / 60));

  onHeaderAction(action: string) {
    this.layout.clickHeaderAction(action);
  }

  onBottomNavigation(actionId: BottomMenuItem['id']) {
    this.router.navigate([NAVIGATION_ROUTES[actionId]]);
  }
}
