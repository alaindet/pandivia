import { Component, OnInit, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { RouterOutlet } from '@angular/router';
import { TranslocoModule } from '@jsverse/transloco';

import { BottomMenuComponent, LinearSpinnerComponent, ModalHostComponent, NotificationsHostComponent } from '@app/common/components';
import { SoftwareUpdateService } from '@app/core/sw-update';
import { UiStoreFeatureService } from '@app/core/ui';
import { UserStoreFeatureService } from '@app/features/user/store/feature';

const imports = [
  RouterOutlet,
  MatIconModule,
  TranslocoModule,
  NotificationsHostComponent,
  ModalHostComponent,
  LinearSpinnerComponent,
  BottomMenuComponent,
];

@Component({
  selector: 'app-root',
  standalone: true,
  imports,
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {

  private uiStore = inject(UiStoreFeatureService);
  private swUpdate = inject(SoftwareUpdateService);
  private userFeature = inject(UserStoreFeatureService);

  notification = this.uiStore.notifications.notification;
  loading = this.uiStore.loading.loading;
  themeConfig = this.uiStore.theme.config;

  ngOnInit() {
    this.swUpdate.check();
    this.userFeature.autoSignIn();
  }

  onDismissNotification() {
    this.uiStore.notifications.dismiss();
  }
}
