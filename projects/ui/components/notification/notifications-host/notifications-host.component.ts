import {
  ChangeDetectionStrategy,
  Component,
  ComponentRef,
  ViewContainerRef,
  ViewEncapsulation,
  computed,
  effect,
  input,
  inputBinding,
  output,
  outputBinding,
  viewChild
} from '@angular/core';

import { cssClassesList } from '@common/utils';
import { NotificationComponent } from '../notification/notification.component';
import {
  NOTIFICATION_POSITION,
  NotificationPosition,
  RuntimeNotification,
} from '../types';

@Component({
  selector: 'app-notifications-host',
  template: '<ng-container #notification />',
  styleUrl: './notifications-host.component.css',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class]': 'cssClasses()',
  },
})
export class NotificationsHostComponent {

  notification = input<RuntimeNotification | null>(null);
  position = input<NotificationPosition>(NOTIFICATION_POSITION.TOP_RIGHT);
  dismissAfter = input(3_000);

  dismissed = output<void>();

  notificationRef = viewChild.required('notification', { read: ViewContainerRef });

  cssClasses = computed(() => cssClassesList([
    'app-notifications-host',
    this.notification() !== null ? '-open' : null,
    `-position-${this.position()}`,
  ]));

  private comp: ComponentRef<NotificationComponent> | null = null;

  constructor() {
    effect(() => this.notificationEffect());
  }

  private notificationEffect(): void {
    const vcr = this.notificationRef();
    this.clearNotification(vcr);

    const notification = this.notification();
    if (!notification) {
      return;
    }

    this.comp = this.showNotification(vcr, notification);
  }

  private clearNotification(vcr: ViewContainerRef): void {
    if (this.comp) {
      this.comp.destroy();
    }

    if (vcr.length) {
      vcr.clear();
    }
  }

  private showNotification(
    vcr: ViewContainerRef,
    notification: RuntimeNotification,
  ): ComponentRef<NotificationComponent> {
    return vcr.createComponent(NotificationComponent, {
      bindings: [
        inputBinding('notificationId', () => notification.id),
        inputBinding('notificationType', () => notification.type),
        inputBinding('more', () => notification.more),
        inputBinding('message', () => notification.message),
        inputBinding('dismissAfter', () => this.dismissAfter()),
        outputBinding('dismissed', () => this.dismissed.emit()),
      ],
    });
  }
}
