import {
  ChangeDetectionStrategy,
  Component,
  HostBinding,
  ViewEncapsulation,
  computed,
  input,
  output,
} from '@angular/core';
import { TranslocoModule } from '@jsverse/transloco';
import {
  NOTIFICATION_POSITION,
  NotificationPosition,
  RuntimeNotification,
} from '@common/types';
import { cssClassesList } from '@common/utils';

import { NOTIFICATION_TIMEOUT } from '@app/core/ui';
import { NotificationComponent } from '../notification/notification.component';

@Component({
  selector: 'app-notifications-host',
  imports: [TranslocoModule, NotificationComponent],
  templateUrl: './notifications-host.component.html',
  styleUrl: './notifications-host.component.css',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'app-notifications-host' },
})
export class NotificationsHostComponent {
  notification = input<RuntimeNotification | null>(null);
  position = input<NotificationPosition>(NOTIFICATION_POSITION.TOP_RIGHT);

  dismissed = output<void>();

  @HostBinding('class')
  get cssClass() {
    return this.cssClasses();
  }

  NOTIFICATION_TIMEOUT = NOTIFICATION_TIMEOUT;
  cssClasses = computed(() =>
    cssClassesList([
      this.notification() !== null ? '-open' : null,
      `-position-${this.position()}`,
    ])
  );
}
