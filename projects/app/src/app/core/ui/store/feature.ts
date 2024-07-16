import { Injectable } from '@angular/core';

import packageJson from '@root/package.json';
import { createUiLoadingController } from './loading';
import { createUiNotificationController } from './notifications';
import { createUiTitleController } from './title';
import { createUiThemeController } from './theme';
import { createUiNavigationController } from './navigation';

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
