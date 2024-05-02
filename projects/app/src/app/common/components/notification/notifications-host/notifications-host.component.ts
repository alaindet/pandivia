import { ChangeDetectionStrategy, Component, HostBinding, ViewEncapsulation, effect, input, output } from '@angular/core';

import { NOTIFICATION_POSITION, NotificationPosition, RuntimeNotification } from '@app/common/types';
import { cssClassesList } from '@app/common/utils';
import { NOTIFICATION_TIMEOUT } from '@app/core/ui';
import { NotificationComponent } from '../notification/notification.component';

const imports = [
  NotificationComponent,
];

@Component({
  selector: 'app-notifications-host',
  standalone: true,
  imports,
  templateUrl: './notifications-host.component.html',
  styleUrls: ['./notifications-host.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'app-notifications-host' },
})
export class NotificationsHostComponent {

  notification = input<RuntimeNotification | null>(null);
  position = input<NotificationPosition>(NOTIFICATION_POSITION.TOP_RIGHT);

  dismissed = output<void>();

  @HostBinding('class')
  cssClasses!: string;

  NOTIFICATION_TIMEOUT = NOTIFICATION_TIMEOUT;

  onStyleChange$ = effect(() => {
    this.cssClasses = cssClassesList([
      this.notification() !== null ? '-open' : null,
      `-position-${this.position()}`,
    ]);
  });
}
