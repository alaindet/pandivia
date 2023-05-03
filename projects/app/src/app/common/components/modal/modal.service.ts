import { ChangeDetectorRef, EmbeddedViewRef, Injectable, OnDestroy, TemplateRef, ViewContainerRef, inject } from '@angular/core';

import { DataSource, OnceSource } from '@app/common/sources';
import { Subject, firstValueFrom, takeUntil, tap } from 'rxjs';
import { ModalConfig, ModalRef, ModalTemplateInput } from './types';

@Injectable({
  providedIn: 'root',
})
export class ModalService implements OnDestroy {

  private once = new OnceSource();
  private target: ViewContainerRef | null = null;
  private ref: ModalRef<any> | null = null;
  private _open$ = new DataSource<boolean>(false, this.once.event$);
  private modalTemplateRefs: { [modalId: string]: EmbeddedViewRef<any> } = {};
  private config: ModalConfig = {
    withFooterControls: false,
    // ...
  };

  open$ = this._open$.data$;

  ngOnDestroy() {
    this.once.trigger();
  }

  registerTarget(target: ViewContainerRef) {
    this.target = target;
  }

  setConfig(config: Partial<ModalConfig>) {
    this.config = { ...this.config, ...config };
  }

  close() {
    this.ref?.close();
  }

  openByTemplate<TInput extends any, TOutput extends any>(
    modalId: string,
    template: TemplateRef<ModalTemplateInput<TInput>>,
    data: TInput,
  ): ModalRef<TOutput> {

    if (!this.target) {
      throw new Error('Missing modal target');
    }

    this.modalTemplateRefs[modalId]?.destroy();

    const closed$ = new Subject<TOutput | undefined>();

    this.target.clear();
    const modalData: ModalTemplateInput<TInput> = { $implicit: data };
    const viewRef = this.target.createEmbeddedView(template, modalData);
    this._open$.next(true);
    this.modalTemplateRefs[modalId] = viewRef;

    const closed = firstValueFrom(
      closed$.pipe(
        takeUntil(this.once.event$),
        tap(() => this._open$.next(false)),
      )
    );

    const close = (data?: TOutput) => {
      this.modalTemplateRefs[modalId]?.destroy();
      closed$.next(data);
    };

    const ref = { closed, close };
    this.ref = ref;

    return ref;
  }

  // TODO
  showByComponent<T extends any>(
    modalId: string,
    component: any, // TODO: Typing
    data: T,
  ): ModalService {
    // ...

    return this;
  }
}
