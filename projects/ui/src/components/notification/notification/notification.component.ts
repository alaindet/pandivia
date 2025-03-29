import {
  ChangeDetectionStrategy,
  Component,
  EffectCleanupRegisterFn,
  ElementRef,
  HostBinding,
  Renderer2,
  ViewEncapsulation,
  effect,
  inject,
  input,
  numberAttribute,
  output,
  signal,
} from '@angular/core';
import { NgIcon } from '@ng-icons/core';
import {
  matCheckCircle,
  matReportProblem,
} from '@ng-icons/material-icons/baseline';
import { NOTIFICATION_TYPE, NotificationType } from '@common/types';

const NOTIFICATION_ICON: Record<NotificationType, string> = {
  [NOTIFICATION_TYPE.SUCCESS]: matCheckCircle,
  [NOTIFICATION_TYPE.ERROR]: matReportProblem,
};

@Component({
  selector: 'app-notification',
  imports: [NgIcon],
  templateUrl: './notification.component.html',
  styleUrl: './notification.component.css',
  host: { class: 'app-notification' },
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotificationComponent {
  private host = inject(ElementRef);
  private renderer = inject(Renderer2);

  notificationId = input.required<number>();
  notificationType = input.required<NotificationType>();
  more = input(0, { transform: numberAttribute });
  dismissAfter = input(3_000);

  dismissed = output<void>();

  @HostBinding('style.--_transition-duration')
  get cssDuration(): string {
    return `${this.dismissAfter()}ms`;
  }

  notificationIcon = signal('');

  notificationEffect = effect(this.effectOnNotificationType.bind(this));

  notificationIdEffect = effect(() => {
    this.notificationId(); // <-- Create dependency
    this.stopAnimation();
    setTimeout(() => this.startAnimation());
  });

  private effectOnNotificationType(onCleanup: EffectCleanupRegisterFn): void {
    const notificationType = this.notificationType();
    this.notificationIcon.set(NOTIFICATION_ICON[notificationType]);
    this.renderer.addClass(
      this.host.nativeElement,
      `-type-${notificationType}`
    );

    onCleanup(() => {
      const cssPrev = `-type-${notificationType}`;
      this.renderer.removeClass(this.host.nativeElement, cssPrev);
    });
  }

  private stopAnimation(): void {
    this.renderer.removeClass(this.host.nativeElement, '-animating');
    this.renderer.addClass(this.host.nativeElement, '-stopped');
  }

  private startAnimation(): void {
    this.renderer.removeClass(this.host.nativeElement, '-stopped');
    this.renderer.addClass(this.host.nativeElement, '-animating');
  }
}
