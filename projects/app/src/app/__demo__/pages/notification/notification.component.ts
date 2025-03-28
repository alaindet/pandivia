import { Component, inject } from '@angular/core';
import { ButtonComponent } from '@ui/components/button';

import { UiStore } from '@app/core/ui';

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
