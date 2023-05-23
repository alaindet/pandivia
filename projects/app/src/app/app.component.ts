import { Component, OnInit, inject } from '@angular/core';
import { AsyncPipe, NgIf } from '@angular/common';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { Store } from '@ngrx/store';
import { filter, map } from 'rxjs';

import { NAVIGATION_ROUTES } from '@app/core';
import { BottomNavigationComponent, LinearSpinnerComponent, ModalHostComponent, NotificationsHostComponent } from './common/components';
import { notificationsActions, selectNavigation, selectNotification, selectUiIsLoading } from './core/store';
import { MatIconModule } from '@angular/material/icon';

const IMPORTS = [
  NgIf,
  AsyncPipe,
  RouterOutlet,
  NotificationsHostComponent,
  ModalHostComponent,
  LinearSpinnerComponent,
  BottomNavigationComponent,
  MatIconModule,
];

@Component({
  selector: 'app-root',
  standalone: true,
  imports: IMPORTS,
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  host: { class: 'container' },
})
export class AppComponent implements OnInit {

  private store = inject(Store);
  private router = inject(Router);

  notification$ = this.store.select(selectNotification);
  loading = false;
  navigation$ = this.store.select(selectNavigation);

  // TODO: Move demo to another project!
  // TODO: Anchor bottom navigation to layout
  isNotDemo$ = this.router.events.pipe(
    filter((e): e is NavigationEnd => e instanceof NavigationEnd),
    map(e => !e.url.startsWith('/demo')),
  );

  ngOnInit() {
    // This guarantees no NG0100 error happens
    // "Expression has changed after it was checked"
    this.store.select(selectUiIsLoading)
      .subscribe(loading => queueMicrotask(() => this.loading = loading));
  }

  onDismissNotification() {
    this.store.dispatch(notificationsActions.dismiss());
  }

  onBottomNavigationChange(navigationItem: string) {
    this.router.navigate([NAVIGATION_ROUTES[navigationItem]]);
  }
}
