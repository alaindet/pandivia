import { Component, inject } from '@angular/core';
import { ButtonComponent } from '@ui/components';

import { UiStore } from '@demo/ui';

@Component({
  selector: 'app-demo-notification',
  imports: [ButtonComponent],
  templateUrl: './notification.component.html',
})
export class NotificationDemoPageComponent {
  private uiStore = inject(UiStore);

  onAddSuccess() {
    this.uiStore.notifications.success('A success message');
  }

  onAddError() {
    this.uiStore.notifications.error('An error message');
  }
}
