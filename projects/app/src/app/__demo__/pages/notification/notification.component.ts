import { Component, inject } from '@angular/core';
import { ButtonComponent } from '@app/common/components';

import { uiNotificationsActions } from '@app/core';
import { Store } from '@ngrx/store';

const imports = [
  ButtonComponent,
];

@Component({
  selector: 'app-demo-notification',
  standalone: true,
  imports,
  templateUrl: './notification.component.html',
})
export class NotificationDemoPageComponent {

  private store = inject(Store);

  onAddSuccess() {
    const message = 'A success message';
    this.store.dispatch(uiNotificationsActions.addSuccess({ message }));
  }

  onAddError() {
    const message = 'An error message';
    this.store.dispatch(uiNotificationsActions.addError({ message }));
  }
}
