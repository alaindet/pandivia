import { Component, OnInit, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { RouterOutlet } from '@angular/router';
import { TranslocoModule } from '@jsverse/transloco';

import {
  LinearSpinnerComponent,
  ModalHostComponent,
  NotificationsHostComponent,
} from '@app/common/components';
import { SoftwareUpdateService } from '@app/core/sw-update';
import { UiStore } from '@app/core/ui';
import { UserStore } from '@app/features/user/store/feature';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    MatIconModule,
    TranslocoModule,
    NotificationsHostComponent,
    ModalHostComponent,
    LinearSpinnerComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  private uiStore = inject(UiStore);
  private swUpdate = inject(SoftwareUpdateService);
  private userStore = inject(UserStore);

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
