import { AsyncPipe, NgIf } from '@angular/common';
import { Component, inject } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { Store } from '@ngrx/store';

import { filter, map } from 'rxjs';
import { BottomNavigationComponent, LinearSpinnerComponent, ModalHostComponent, NotificationsHostComponent } from './common/components';
import { notificationsActions, selectNavigation, selectNotification, selectUiIsLoading } from './core/store';
import { MatIcon, MatIconModule } from '@angular/material/icon';

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
  host: {
    class: 'container',
  },
})
export class AppComponent {

  private store = inject(Store);
  private router = inject(Router);

  notification$ = this.store.select(selectNotification);
  loading$ = this.store.select(selectUiIsLoading);
  navigation$ = this.store.select(selectNavigation);
  isNotDemo$ = this.router.events.pipe(
    filter((e): e is NavigationEnd => e instanceof NavigationEnd),
    map(e => !e.url.startsWith('/demo')),
  );

  onDismissNotification() {
    this.store.dispatch(notificationsActions.dismiss());
  }

  onBottomNavigationChange(navigateTo: string) {
    console.log('onBottomNavigationChange', navigateTo);
  }
}
