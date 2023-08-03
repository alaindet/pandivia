import { Injectable, OnDestroy, computed } from '@angular/core';

import { OnceSource } from '@app/common/sources';
import { createBackButtonController } from './back-button.controller';
import { createHeaderActionsController } from './header-actions.controller';
import { createHeaderCountersController } from './header-counters.controller';
import { createSearchController } from './search.controller';
import { createTitleController } from './title.controller';


@Injectable()
export class StackedLayoutService implements OnDestroy {

  private once = new OnceSource();

  search = createSearchController(this.once.event$);
  title = createTitleController(this.once.event$);
  headerActions = createHeaderActionsController(this.once.event$);
  headerCounters = createHeaderCountersController(this.once.event$);
  backButton = createBackButtonController(this.once.event$);
  // ...

  vm = computed(() => ({
    search: this.search.data(),
    title: this.title.data(),
    headerActions: this.headerActions.data(),
    headerCounters: this.headerCounters.data(),
    backButton: this.backButton.data(),
    // ...
  }));

  ngOnDestroy(): void {
    this.once.trigger();
  }
}
