import { Injectable, OnDestroy } from '@angular/core';

import { DataSource, EventSource, OnceSource } from '@app/common/sources';
import { BACK_BUTTON_STATUS, Counters } from '@app/common/types';
import { StackedLayoutViewModel } from './types';
import { ActionsMenuItem } from '@app/common/components';
import { Observable } from 'rxjs';

const VM: StackedLayoutViewModel = {
  title: '',
  headerActions: [],
  headerCounters: null,
  backButton: BACK_BUTTON_STATUS.NONE,
};

// TODO: Convert all to signals
@Injectable()
export class StackedLayoutService implements OnDestroy {

  private once = new OnceSource();

  // State
  private _vm$ = new DataSource<StackedLayoutViewModel>(VM, this.once.event$);

  // Events
  private _controlledBackButtonEvent$ = new EventSource<void>(this.once.event$);
  private _headerActionEvent$ = new EventSource<string>(this.once.event$);

  get vm(): Observable<StackedLayoutViewModel> {
    return this._vm$.data$;
  }

  get controlledBackButtonEvent() {
    return this._controlledBackButtonEvent$.event$
  }

  get headerActionEvent() {
    return this._headerActionEvent$.event$;
  }

  ngOnDestroy(): void {
    this.once.trigger();
  }

  clickControlledBackButton() {
    this._controlledBackButtonEvent$.next();
  }

  clickHeaderAction(actionId: string) {
    this._headerActionEvent$.next(actionId);
  }

  setTitle(title: string) {
    this._vm$.next(vm => ({ ...vm, title }));
  }

  setHeaderActions(headerActions: ActionsMenuItem[]) {
    this._vm$.next(vm => ({ ...vm, headerActions }));
  }

  clearHeaderActions() {
    this._vm$.next(vm => ({ ...vm, headerActions: [] }));
  }

  enableBackButton() {
    this._vm$.next(vm => ({ ...vm, backButton: BACK_BUTTON_STATUS.NATIVE }));
  }

  disableBackButton() {
    this._vm$.next(vm => ({ ...vm, backButton: BACK_BUTTON_STATUS.NONE }));
  }

  enableControlledBackButton() {
    this._vm$.next(vm => ({ ...vm, backButton: BACK_BUTTON_STATUS.CONTROLLED }));
    return this._controlledBackButtonEvent$.event$;
  }

  disabledControlledBackButton() {
    this._vm$.next(vm => ({ ...vm, backButton: BACK_BUTTON_STATUS.NONE }));
  }

  setHeaderCounters(counters: Counters) {
    this._vm$.next(vm => ({ ...vm, headerCounters: counters }));
  }

  clearHeaderCounters() {
    this._vm$.next(vm => ({ ...vm, headerCounters: null }));
  }
}
