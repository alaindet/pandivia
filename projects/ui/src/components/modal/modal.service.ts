import {
  Injectable,
  OnDestroy,
  TemplateRef,
  ViewContainerRef,
  signal,
} from '@angular/core';

import { Subject, filter, map, of, switchMap, take, throwError } from 'rxjs';
import {
  BaseModalComponent,
  MODAL_OUTPUT_STATUS,
  ModalOptions,
  ModalOutput,
  ModalRef,
} from './types';
import { createBodyScrollingController } from './scrolling.controller';

@Injectable({
  providedIn: 'root',
})
export class ModalService implements OnDestroy {
  private target: ViewContainerRef | null = null;
  private focusedBeforeModal: HTMLElement | null = null;
  isOpen = signal(false);
  isFullPage = signal(false);
  private _closed$ = new Subject<ModalOutput<any>>();
  private _confirmClicked$ = new Subject<void>();
  private bodyScrolling = createBodyScrollingController();

  headerTemplate = signal<TemplateRef<void> | null>(null);
  footerTemplate = signal<TemplateRef<void> | null>(null);

  constructor() {
    this._closed$.subscribe(() => {
      this.isFullPage.set(false);
      this.bodyScrolling.restore();
    });
  }

  ngOnDestroy() {
    this._closed$.complete();
    this._confirmClicked$.complete();
  }

  registerTarget(target: ViewContainerRef) {
    this.target = target;
  }

  registerHeaderTemplate(template: TemplateRef<void>) {
    this.headerTemplate.set(template);
  }

  registerFooterTemplate(template: TemplateRef<void>) {
    this.footerTemplate.set(template);
  }

  close<TOutput extends any>(output: ModalOutput<TOutput>) {
    this.clear();
    this._closed$.next(output);
  }

  closed() {
    return this._closed$.asObservable().pipe(
      switchMap((output) => {
        if (output.status === MODAL_OUTPUT_STATUS.CANCELED) {
          return throwError(() => 'components.modal.canceled');
        }
        return of(output.data);
      }),
      take(1)
    );
  }

  cancel() {
    this.clear();
    this._closed$.next({
      status: MODAL_OUTPUT_STATUS.CANCELED,
      data: undefined,
    });
  }

  canceled() {
    return this._closed$.asObservable().pipe(
      filter(({ status }) => status === MODAL_OUTPUT_STATUS.CANCELED),
      map(({ data }) => data),
      take(1)
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
    return this._closed$.pipe(
      filter(({ status }) => status === MODAL_OUTPUT_STATUS.CONFIRMED),
      map(({ data }) => data),
      take(1)
    );
  }

  clickConfirm() {
    this._confirmClicked$.next();
  }

  // TODO: Better typing needed
  open<TInput extends any, TOutput extends any>(
    componentClass: typeof BaseModalComponent<TInput, TOutput>,
    data: TInput,
    options?: ModalOptions
  ): ModalRef<TInput, TOutput> {
    this.focusedBeforeModal = document.activeElement as HTMLElement | null;
    this.bodyScrolling.block();

    if (!!options?.fullPage) {
      this.isFullPage.set(true);
    }

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
      confirmClicked$: this._confirmClicked$.asObservable(),
      closed: this.closed.bind(this),
    };

    const component = this.target.createComponent(componentClass as any);
    const instance = component.instance as BaseModalComponent<TInput, TOutput>;
    instance.modal = modalRef;

    this.isOpen.set(true);
    return modalRef;
  }

  private clear(): void {
    this.target!.clear();
    this.isOpen.set(false);
    this.headerTemplate.set(null);
    this.footerTemplate.set(null);
    queueMicrotask(() => this.focusedBeforeModal?.focus());
  }
}
