import { Component, OnInit, effect, inject } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { Store } from '@ngrx/store';

import { StackedLayoutComponent, StackedLayoutService } from '@app/common/layouts';
import { BottomMenuItem } from '@app/common/components';
import { NAVIGATION_ROUTES } from '../../constants';
import { selectNavigation, selectTitle } from '../../store';

const IMPORTS = [
  StackedLayoutComponent,
  RouterOutlet,
];

@Component({
  selector: 'app-logged-page-collection',
  standalone: true,
  imports: IMPORTS,
  templateUrl: './logged.component.html',
  providers: [StackedLayoutService],
})
export class LoggedPageCollectionComponent implements OnInit {
  
  layout = inject(StackedLayoutService);
  private router = inject(Router);
  private store = inject(Store);

  nav!: { items: BottomMenuItem[]; current: string | null; };

  ngOnInit() {
    this.store.select(selectNavigation).subscribe(nav => this.nav = nav);
  }

  onHeaderAction(action: string) {
    this.layout.clickHeaderAction(action);
  }

  onBottomNavigation(actionId: BottomMenuItem['id']) {
    this.router.navigate([NAVIGATION_ROUTES[actionId]]);
  }
}