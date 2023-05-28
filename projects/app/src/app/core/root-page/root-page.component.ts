import { Component, OnInit, inject } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';

import { StackedLayoutComponent, StackedLayoutService } from '@app/common/layouts';
import { Store } from '@ngrx/store';
import { selectNavigation } from '../store';
import { BottomMenuItem } from '@app/common/components';
import { NAVIGATION_ROUTES } from '../constants';

const IMPORTS = [
  StackedLayoutComponent,
  RouterOutlet,
];

@Component({
  selector: 'app-root-page',
  standalone: true,
  imports: IMPORTS,
  templateUrl: './root-page.component.html',
  providers: [StackedLayoutService],
})
export class RootPageComponent implements OnInit {
  
  svc = inject(StackedLayoutService);
  private router = inject(Router);
  private store = inject(Store);
  nav!: { items: BottomMenuItem[]; current: string | null; };

  ngOnInit() {
    this.store.select(selectNavigation).subscribe(nav => this.nav = nav);
  }

  onHeaderAction(action: string) {
    console.log('RootPageComponent.onHeaderAction', action);
  }

  onBottomNavigation(actionId: BottomMenuItem['id']) {
    this.router.navigate([NAVIGATION_ROUTES[actionId]]);
  }
}