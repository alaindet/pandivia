import { Injectable } from '@angular/core';

import { createNotificationController } from './notification.controller';
import { createLoaderController } from './loader.controller';

@Injectable({
  providedIn: 'root',
})
export class UiService {
  loader = createLoaderController();
  notification = createNotificationController();
}
