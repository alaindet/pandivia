import { Injectable, inject } from '@angular/core';

import { createNotificationController } from './notification.controller';
import { createLoaderController } from './loader.controller';
import { ThemeService } from '../theme';
import { LanguageService } from '../language';
import { UiStoreFeatureService } from '.';

@Injectable({
  providedIn: 'root',
})
export class UiService {

  private uiStore = inject(UiStoreFeatureService);

  loader = this.uiStore.loading;

  loader = createLoaderController();
  notification = createNotificationController();
  theme = inject(ThemeService); // Triggers side effects upon creation
  language = inject(LanguageService); // Triggers side effects upon creation
}
