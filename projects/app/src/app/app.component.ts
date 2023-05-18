import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';

import { notificationsActions, selectNotification } from './core/store';
import { NotificationsHostComponent } from './common/components';
import { ModalHostComponent } from './common/components/modal';
import { Store } from '@ngrx/store';

const IMPORTS = [
  CommonModule,
  RouterOutlet,
  NotificationsHostComponent,
  ModalHostComponent,
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

  dismissNotification() {
    this.store.dispatch(notificationsActions.dismiss());
  }
}
