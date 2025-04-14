import { Component, OnInit, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TranslocoModule } from '@jsverse/transloco';
import {
  LinearSpinnerComponent,
  ModalHostComponent,
  ModalService,
  NotificationsHostComponent,
} from '@ui/components';

import { SoftwareUpdateService } from '@app/core/sw-update';
import { NOTIFICATION_TIMEOUT, UiStore } from '@app/core/ui';
import { UserStore } from '@app/features/user/store/feature';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    TranslocoModule,
    NotificationsHostComponent,
    ModalHostComponent,
    LinearSpinnerComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit {
  private uiStore = inject(UiStore);
  private swUpdate = inject(SoftwareUpdateService);
  private userStore = inject(UserStore);

  private modal = inject(ModalService); // TODO: Remove

  NOTIFICATION_TIMEOUT = NOTIFICATION_TIMEOUT;
  notification = this.uiStore.notifications.notification;
  loading = this.uiStore.loader.loading;
  themeConfig = this.uiStore.theme.config;

  ngOnInit() {
    this.swUpdate.check();
    this.userStore.autoSignIn();
  }

  onDismissNotification() {
    this.uiStore.notifications.dismiss();
  }
}
