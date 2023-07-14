import { Component, inject } from '@angular/core';

import { ButtonComponent } from '@app/common/components';

import { UiService } from '@app/core/ui';

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

  private ui = inject(UiService);

  onAddSuccess() {
    this.ui.notification.ok('A success message');
  }

  onAddError() {
    this.ui.notification.err('An error message');
  }
}
