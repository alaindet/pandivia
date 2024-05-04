import { ChangeDetectionStrategy, Component, EffectCleanupRegisterFn, ElementRef, HostBinding, Renderer2, ViewEncapsulation, effect, inject, input, output, signal } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

import { NOTIFICATION_TYPE, NotificationType } from '@app/common/types';
import { NOTIFICATION_TIMEOUT } from '@app/core/ui';

const NOTIFICATION_ICON: Record<NotificationType, string> = {
  [NOTIFICATION_TYPE.SUCCESS]: 'check_circle',
  [NOTIFICATION_TYPE.ERROR]: 'report_problem',
};

const imports = [
  MatIconModule,
];

@Component({
  selector: 'app-notification',
  standalone: true,
  imports,
  templateUrl: './notification.component.html',
  styleUrl: './notification.component.scss',
  host: { class: 'app-notification' },
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotificationComponent {

  private host = inject(ElementRef);
  private renderer = inject(Renderer2);

  notificationId = input.required<number>();
  notificationType = input.required<NotificationType>();
  more = input(0);
  dismissAfter = input(NOTIFICATION_TIMEOUT);

  dismissed = output<void>();

  @HostBinding('style.--_transition-duration')
  cssDuration = `${NOTIFICATION_TIMEOUT}ms`;

  notificationIcon = signal('');

  dismissEffect = effect(() => {
    this.cssDuration = `${this.dismissAfter()}ms`;
  });

  notificationEffect = effect(this.effectOnNotificationType.bind(this), {
    allowSignalWrites: true,
  });

  notificationIdEffect = effect(() => {
    this.notificationId(); // <-- Create dependency
    this.stopAnimation();
    setTimeout(() => this.startAnimation());
  });

  private effectOnNotificationType(onCleanup: EffectCleanupRegisterFn): void {
    const notificationType = this.notificationType();
    this.notificationIcon.set(NOTIFICATION_ICON[notificationType]);
    this.renderer.addClass(this.host.nativeElement, `-type-${notificationType}`);

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
