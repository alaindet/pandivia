import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Store } from '@ngrx/store';

import { notificationsActions, selectNotification } from './core/store';
import { NotificationsHostComponent } from './common/components';
import { ModalHostComponent } from './common/components/modal';

const IMPORTS = [
  CommonModule,
  RouterModule,
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
