import { Injectable, OnDestroy, signal } from '@angular/core';
import { ActionsMenuItem } from '@app/common/components';
import { EventSource, OnceSource } from '@app/common/sources';

// TODO: Connect title to UI store feature
@Injectable()
export class StackedLayoutService implements OnDestroy {

  private once = new OnceSource();

  title = signal('');
  headerActions = signal<ActionsMenuItem[]>([]);
  withBackButton = signal(false);
  withControlledBackButton = signal(false);

  _backClicked$ = new EventSource<void>(this.once.event$);

  ngOnDestroy(): void {
    this.once.trigger();
  }

  clickControlledBackButton() {
    this._backClicked$.next();
  }

  enableControlledBackButton() {
    this.withControlledBackButton.set(true);
    return this._backClicked$.event$;
  }

  disabledControlledBackButton() {
    this.withControlledBackButton.set(false);
  }
}