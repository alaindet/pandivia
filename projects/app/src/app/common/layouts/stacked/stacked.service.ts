import { Injectable, OnDestroy, signal } from '@angular/core';
import { ActionsMenuItem } from '@app/common/components';
import { EventSource, OnceSource } from '@app/common/sources';

@Injectable()
export class StackedLayoutService implements OnDestroy {

  private once = new OnceSource();

  // State
  title = signal('');
  headerActions = signal<ActionsMenuItem[]>([]);
  withBackButton = signal(false);
  withControlledBackButton = signal(false);

  // Events
  _backClicked$ = new EventSource<void>(this.once.event$);
  _headerActionClicked$ = new EventSource<string>(this.once.event$);

  get backClickedEvent() {
    return this._backClicked$.event$;
  }

  get headerActionClicked() {
    return this._headerActionClicked$.event$;
  }

  ngOnDestroy(): void {
    this.once.trigger();
  }

  clickControlledBackButton() {
    this._backClicked$.next();
  }

  clickHeaderAction(actionId: string) {
    this._headerActionClicked$.next(actionId);
  }

  enableControlledBackButton() {
    this.withControlledBackButton.set(true);
    return this._backClicked$.event$;
  }

  disabledControlledBackButton() {
    this.withControlledBackButton.set(false);
  }
}