import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, HostBinding, Input, OnChanges, OnInit, Output, ViewEncapsulation } from '@angular/core';

import { NOTIFICATION_POSITION, NotificationPosition, RuntimeNotification } from '@app/common/types';
import { cssClassesList } from '@app/common/utils';
import { NotificationComponent } from '../notification/notification.component';
import { NOTIFICATION_TIMEOUT } from '@app/core/notification';

const IMPORTS = [
  CommonModule,
  NotificationComponent,
];

@Component({
  selector: 'app-notifications-host',
  standalone: true,
  imports: IMPORTS,
  templateUrl: './notifications-host.component.html',
  styleUrls: ['./notifications-host.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'app-notifications-host' },
})
export class NotificationsHostComponent implements OnInit, OnChanges {

  @Input() notification: RuntimeNotification | null = null;
  @Input() position: NotificationPosition = NOTIFICATION_POSITION.TOP_RIGHT;

  @Output() dismissed = new EventEmitter<void>();

  @HostBinding('class') cssClasses!: string;

  NOTIFICATION_TIMEOUT = NOTIFICATION_TIMEOUT;

  ngOnInit() {
    this.updateStyle();
  }

  ngOnChanges() {
    this.updateStyle();
  }

  private updateStyle(): void {
    this.cssClasses = cssClassesList([
      this.notification !== null ? '-open' : null,
      `-position-${this.position}`,
    ]);
  }
}
