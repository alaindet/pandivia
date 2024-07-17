import { Component, inject } from '@angular/core';

import { ButtonComponent } from '@app/common/components';

import { UiStore } from '@app/core/ui';

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

  private uiStore = inject(UiStore);

  onAddSuccess() {
    this.uiStore.notifications.success('A success message');
  }

  onAddError() {
    this.uiStore.notifications.error('An error message');
  }
}
