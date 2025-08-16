import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  OnDestroy,
  ViewEncapsulation,
  computed,
  input,
  numberAttribute,
  output,
  viewChild
} from '@angular/core';
import { NgIcon } from '@ng-icons/core';
import {
  matCheckCircle,
  matReportProblem,
} from '@ng-icons/material-icons/baseline';

import { cssClassesList } from '@common/utils';
import { NOTIFICATION_TYPE, NotificationType } from '../types';

const NOTIFICATION_ICON: Record<NotificationType, string> = {
  [NOTIFICATION_TYPE.SUCCESS]: matCheckCircle,
  [NOTIFICATION_TYPE.ERROR]: matReportProblem,
};

@Component({
  selector: 'app-notification',
  imports: [NgIcon],
  templateUrl: './notification.component.html',
  styleUrl: './notification.component.css',
  host: {
    '[class]': 'cssClasses()',
    '[style.--_transition-duration]': 'cssDuration()',
  },
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotificationComponent implements AfterViewInit, OnDestroy {

  notificationId = input.required<number>();
  notificationType = input.required<NotificationType>();
  message = input<string>();
  more = input(0, { transform: numberAttribute });
  dismissAfter = input(3_000);

  dismissed = output<void>();

  progressRef = viewChild.required('progress', { read: ElementRef });
  progressAnimation: Animation | null = null;

  cssDuration = computed(() => `${this.dismissAfter()}ms`);
  notificationIcon = computed(() => NOTIFICATION_ICON[this.notificationType()]);
  cssClasses = computed(() => cssClassesList([
    'app-notification',
    `-type-${this.notificationType()}`,
  ]));

  ngAfterViewInit() {
    const progressEl = <HTMLDivElement>this.progressRef().nativeElement;

    this.progressAnimation = progressEl.animate(
      [
        { width: '100%' },
        { width: '0%' },
      ],
      {
        duration: this.dismissAfter(),
        easing: 'linear',
        fill: 'forwards',
      },
    );
  }

  ngOnDestroy() {
    if (this.progressAnimation) {
      this.progressAnimation.cancel();
    }
  }
}
