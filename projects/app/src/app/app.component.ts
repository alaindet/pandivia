import { Component, inject } from '@angular/core';
import { AsyncPipe, NgIf } from '@angular/common';
import { RouterOutlet } from '@angular/router';

import { notificationsActions, selectNotification, selectUiIsLoading } from './core/store';
import { LinearSpinnerComponent, NotificationsHostComponent, ModalHostComponent } from './common/components';
import { Store } from '@ngrx/store';

const IMPORTS = [
  NgIf,
  AsyncPipe,
  RouterOutlet,
  NotificationsHostComponent,
  ModalHostComponent,
  LinearSpinnerComponent,
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
  notification$ = this.store.select(selectNotification);
  loading$ = this.store.select(selectUiIsLoading);

  dismissNotification() {
    this.store.dispatch(notificationsActions.dismiss());
  }
}
