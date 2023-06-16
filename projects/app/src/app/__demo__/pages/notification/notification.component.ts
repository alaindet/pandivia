import { Component, inject } from '@angular/core';

import { ButtonComponent } from '@app/common/components';
import { NotificationService } from '@app/core';

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

  private notification = inject(NotificationService);

  onAddSuccess() {
    this.notification.set('success', 'A success message');
  }

  onAddError() {
    this.notification.set('error', 'An error message');
  }
}
