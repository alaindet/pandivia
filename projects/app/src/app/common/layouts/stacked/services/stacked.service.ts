import { Injectable, OnDestroy } from '@angular/core';

import { createBackButtonController } from './back-button.controller';
import { createHeaderActionsController } from './header-actions.controller';
import { createHeaderCountersController } from './header-counters.controller';
import { createSearchController } from './search.controller';
import { createTitleController } from './title.controller';


@Injectable()
export class StackedLayoutService implements OnDestroy {

  search = createSearchController();
  title = createTitleController();
  headerActions = createHeaderActionsController();
  headerCounters = createHeaderCountersController();
  backButton = createBackButtonController();

  ngOnDestroy(): void {
    this.search.destroy();
    this.headerActions.destroy();
    this.backButton.destroy();
  }
}
