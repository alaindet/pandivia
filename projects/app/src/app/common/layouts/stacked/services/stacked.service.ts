import { Injectable, OnDestroy } from '@angular/core';
import { combineLatest } from 'rxjs';

import { OnceSource } from '@app/common/sources';
import { createSearchController } from './search.controller';
import { createTitleController } from './title.controller';
import { createHeaderActionsController } from './header-actions.controller';
import { createHeaderCountersController } from './header-counters.controller';
import { createBackController } from './back.controller';

// TODO: Convert all to signals
@Injectable()
export class StackedLayoutService implements OnDestroy {

  private once = new OnceSource();

  search = createSearchController(this.once.event$);
  title = createTitleController(this.once.event$);
  headerActions = createHeaderActionsController(this.once.event$);
  headerCounters = createHeaderCountersController(this.once.event$);
  back = createBackController(this.once.event$);
  // ...

  vm = combineLatest({
    search: this.search.data,
    title: this.title.data,
    headerActions: this.headerActions.data,
    // ...
  });

  ngOnDestroy(): void {
    this.once.trigger();
  }
}
