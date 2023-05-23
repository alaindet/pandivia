import { Component, inject } from '@angular/core';
import { ButtonComponent } from '@app/common/components';

import { notificationsActions } from '@app/core';
import { Store } from '@ngrx/store';

const IMPORTS = [
  ButtonComponent,
];

@Component({
  selector: 'app-demo-notification',
  standalone: true,
  imports: IMPORTS,
  templateUrl: './notification.component.html',
})
export class NotificationDemoPageComponent {

  private store = inject(Store);

  onAddSuccess() {
    const message = 'A success message';
    this.store.dispatch(notificationsActions.addSuccess({ message }));
  }

  onAddError() {
    const message = 'An error message';
    this.store.dispatch(notificationsActions.addError({ message }));
  }
}
