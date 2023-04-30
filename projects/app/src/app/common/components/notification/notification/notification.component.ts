import { CommonModule } from '@angular/common';
import { Component, EventEmitter, HostBinding, Input, OnChanges, Output, ViewEncapsulation, SimpleChanges, ChangeDetectionStrategy } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

import { NOTIFICATION_TYPE, NotificationType } from '@app/common/types';
import { didInputChange } from '@app/common/utils';
import { NOTIFICATION_TIMEOUT } from '@app/core/constants';

const NOTIFICATION_ICON: { [key in NotificationType]: string } = {
  [NOTIFICATION_TYPE.SUCCESS]: 'check_circle',
  [NOTIFICATION_TYPE.ERROR]: 'report_problem',
};

const IMPORTS = [
  CommonModule,
  MatIconModule,
];

@Component({
  selector: 'app-notification',
  standalone: true,
  imports: IMPORTS,
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss'],
  host: { class: 'app-notification' },
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotificationComponent implements OnChanges{

  @Input() notificationId!: number;
  @Input() notificationType!: NotificationType;
  @Input() more = 0;
  @Input() dismissAfter = NOTIFICATION_TIMEOUT;

  @Output() dismissed = new EventEmitter<void>();

  @HostBinding('class') cssClasses!: string;
  @HostBinding('class.-stopped') cssStopped = true;
  @HostBinding('class.-animating') cssAnimating = false;

  @HostBinding('style.--app-notification-transition-duration')
  cssDuration = `${NOTIFICATION_TIMEOUT}ms`;

  notificationIcon!: string;

  ngOnChanges(changes: SimpleChanges) {

    if (didInputChange(changes['notificationId'])) {
      this.stopAnimation();
    }

    if (didInputChange(changes['notificationType'])) {
      this.cssClasses = `-type-${this.notificationType}`;
      this.notificationIcon = NOTIFICATION_ICON[this.notificationType];
    }

    if (didInputChange(changes['dismissAfter'])) {
      this.cssDuration = `${this.dismissAfter}ms`;
    }

    // TODO: This is seriously bad
    setTimeout(() => this.startAnimation(), 20);
  }

  private startAnimation(): void {
    this.cssStopped = false;
    this.cssAnimating = true;
  }

  private stopAnimation(): void {
    this.cssStopped = true;
    this.cssAnimating = false;
  }
}
