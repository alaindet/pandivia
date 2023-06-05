import { Injectable, OnDestroy, TemplateRef, ViewContainerRef } from '@angular/core';

import { DataSource, EventSource, OnceSource } from '@app/common/sources';
import { filter, map, of, switchMap, take, throwError } from 'rxjs';
import { BaseModalComponent, MODAL_OUTPUT_STATUS, ModalOutput, ModalRef } from './types';

@Injectable({
  providedIn: 'root',
})
export class ModalService implements OnDestroy {

  private once = new OnceSource();
  private target: ViewContainerRef | null = null;
  private _open$ = new DataSource<boolean>(false, this.once.event$);
  private _closed$ = new EventSource<ModalOutput<any>>(this.once.event$);
  private _confirmClicked$ = new EventSource<void>(this.once.event$);
  private focusedBeforeModal: HTMLElement | null = null;

  headerTemplate: TemplateRef<void> | null = null;
  footerTemplate: TemplateRef<void> | null = null;
  open$ = this._open$.data$;

  ngOnDestroy() {
    this.once.trigger();
  }

  registerTarget(target: ViewContainerRef) {
    this.target = target;
  }

  registerHeaderTemplate(template: TemplateRef<void>) {
    this.headerTemplate = template;
  }

  registerFooterTemplate(template: TemplateRef<void>) {
    this.footerTemplate = template;
  }

  close<TOutput extends any>(output: ModalOutput<TOutput>) {
    this.clear();
    this._closed$.next(output);
  }

  closed() {
    return this._closed$.event$.pipe(take(1), switchMap(output => {
      if (output.status === MODAL_OUTPUT_STATUS.CANCELED) {
        return throwError(() => new Error('Modal canceled'));
      }
      return of(output.data);
    }));
  }

  cancel() {
    this.clear();
    this._closed$.next({
      status: MODAL_OUTPUT_STATUS.CANCELED,
      data: undefined,
    });
  }

  canceled() {
    return this._closed$.event$.pipe(
      filter(({ status }) => status === MODAL_OUTPUT_STATUS.CANCELED),
      map(({ data }) => data),
      take(1),
    );
  }

  confirm<TOutput extends any>(data: TOutput) {
    this.clear();
    this._closed$.next({
      status: MODAL_OUTPUT_STATUS.CONFIRMED,
      data,
    });
  }

  confirmed() {
    return this._closed$.event$.pipe(
      filter(({ status }) => status === MODAL_OUTPUT_STATUS.CONFIRMED),
      map(({ data }) => data),
      take(1),
    );
  }

  clickConfirm() {
    this._confirmClicked$.next();
  }

  // TODO: Better typing needed
  open<TInput extends any, TOutput extends any>(
    componentClass: typeof BaseModalComponent<TInput, TOutput>,
    data: TInput,
  ): ModalRef<TInput, TOutput> {
    
    this.focusedBeforeModal = document.activeElement as HTMLElement | null;

    if (!this.target) {
      throw new Error('Missing modal target');
    }

    this.target.clear();

    const modalRef: ModalRef<TInput, TOutput> = {
      data,
      cancel: this.cancel.bind(this),
      canceled: this.canceled.bind(this),
      confirm: this.confirm.bind(this),
      confirmed: this.confirmed.bind(this),
      confirmClicked$: this._confirmClicked$.event$,
      closed: this.closed.bind(this),
    };

    const component = this.target.createComponent(componentClass as any);
    const instance = component.instance as BaseModalComponent<TInput, TOutput>;
    instance.modal = modalRef;

    this._open$.next(true);
    return modalRef;
  }

  private clear(): void {
    this.target!.clear();
    this._open$.next(false);
    this.headerTemplate = null;
    this.footerTemplate = null;
    queueMicrotask(() => this.focusedBeforeModal?.focus());
  }
}
