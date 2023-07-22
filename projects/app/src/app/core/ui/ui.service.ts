import { Injectable, inject } from '@angular/core';

import { createNotificationController } from './notification.controller';
import { createLoaderController } from './loader.controller';
import { ThemeService } from '../theme';
import { LanguageService } from '../language';

@Injectable({
  providedIn: 'root',
})
export class UiService {
  loader = createLoaderController();
  notification = createNotificationController();
  theme = inject(ThemeService);
  language = inject(LanguageService);
}
