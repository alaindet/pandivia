import { Injectable } from '@angular/core';

import packageJson from '@root/package.json';
import { createUiLoadingController } from './__loading';
import { createUiNotificationController } from './__notifications';
import { createUiTitleController } from './__title';
import { createUiThemeController } from './__theme';
import { createUiNavigationController } from './__navigation';

@Injectable({
  providedIn: 'root',
})
export class UiStoreFeatureService {

  notifications = createUiNotificationController();
  loading = createUiLoadingController();
  title = createUiTitleController();
  theme = createUiThemeController();
  navigation = createUiNavigationController();
  version = packageJson.version;

  constructor() {
    this.notifications.init();
    this.title.init();
  }
}
