import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, EventEmitter, HostBinding, Input, OnChanges, Output, Renderer2, SimpleChanges, ViewEncapsulation, inject } from '@angular/core';
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
export class NotificationComponent implements OnChanges {

  private cdr = inject(ChangeDetectorRef);
  private host = inject(ElementRef);
  private renderer = inject(Renderer2);

  @Input() notificationId!: number;
  @Input() notificationType!: NotificationType;
  @Input() more = 0;
  @Input() dismissAfter = NOTIFICATION_TIMEOUT;

  @Output() dismissed = new EventEmitter<void>();

  @HostBinding('style.--app-notification-transition-duration')
  cssDuration = `${NOTIFICATION_TIMEOUT}ms`;

  notificationIcon!: string;

  ngOnChanges(changes: SimpleChanges) {

    const el = this.host.nativeElement;

    if (didInputChange(changes['dismissAfter'])) {
      this.cssDuration = `${this.dismissAfter}ms`;
    }

    if (didInputChange(changes['notificationType'])) {
      this.notificationIcon = NOTIFICATION_ICON[this.notificationType];

      if (!changes['notificationType'].isFirstChange()) {
        const cssPrev = `-type-${changes['notificationType'].previousValue}`;
        this.renderer.removeClass(el, cssPrev);
      }

      this.renderer.addClass(el, `-type-${this.notificationType}`);
    }

    if (didInputChange(changes['notificationId'])) {
      this.renderer.removeClass(el, '-animating');
      this.renderer.addClass(el, '-stopped');
    }

    setTimeout(() => {
      this.renderer.removeClass(el, '-stopped');
      this.renderer.addClass(el, '-animating');
      this.cdr.detectChanges();
    }, 20);
  }
}
