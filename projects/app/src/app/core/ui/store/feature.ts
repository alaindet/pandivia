import { Injectable } from '@angular/core';

import packageJson from '@root/package.json';
import { createUiLoaderController } from './loader';
import { createUiNotificationController } from './notifications';
import { createUiTitleController } from './title';
import { createUiThemeController } from './theme';
import { createUiNavigationController } from './navigation';

@Injectable({
  providedIn: 'root',
})
export class UiStore {

  notifications = createUiNotificationController();
  loader = createUiLoaderController();
  title = createUiTitleController();
  theme = createUiThemeController();
  navigation = createUiNavigationController();
  version = packageJson.version;

  constructor() {
    this.notifications.init();
    this.title.init();
    this.theme.init();
  }
}
