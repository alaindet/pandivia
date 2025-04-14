import { Component, OnInit, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TranslocoModule } from '@jsverse/transloco';
import {
  ConfirmPromptModalComponent,
  LinearSpinnerComponent,
  ModalService,
} from '@ui/components';
import { ModalHostComponent } from '@ui/components';
import { NotificationsHostComponent } from '@ui/components';

import { SoftwareUpdateService } from '@app/core/sw-update';
import { UiStore, NOTIFICATION_TIMEOUT } from '@app/core/ui';
import { UserStore } from '@app/features/user/store/feature';
import { take } from 'rxjs';

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

  // TODO: Remove
  onOpenUpgradeVersion() {
    const modal$ = this.modal.open(ConfirmPromptModalComponent, {
      action: 'upgrade-application',
      title: 'Upgrade',
      message:
        'A new version of the application was installed. Do you want to activate it now? If not, it will activate automatically next time.',
    });

    modal$
      .closed()
      .pipe(take(1))
      .subscribe({
        error: () => console.log('Canceled'),
        next: () => console.log('Confirmed'),
      });
  }
}
