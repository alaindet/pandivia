import { ChangeDetectorRef, Injectable, OnDestroy, ViewContainerRef, inject } from '@angular/core';

import { DataSource, OnceSource, EventSource } from '@app/common/sources';
import { Observable, Subject, take } from 'rxjs';
import { ModalRef } from './types';

@Injectable({
  providedIn: 'root',
})
export class ModalService implements OnDestroy {

  private cdr = inject(ChangeDetectorRef);

  private once = new OnceSource();
  private target: ViewContainerRef | null = null;
  private _open$ = new DataSource<boolean>(false, this.once.event$);
  private _closed$ = new EventSource<any>(this.once.event$);
  open$ = this._open$.data$;

  ngOnDestroy() {
    this.once.trigger();
  }

  registerTarget(target: ViewContainerRef) {
    this.target = target;
  }

  close<TOutput extends any>(outputData?: TOutput) {
    this.target?.clear();
    this._open$.next(false);
    this._closed$.next(outputData);
  }

  open<TInput extends any, TOutput extends any>(
    componentClass: any, // TODO: Type?
    inputData: TInput,
  ): ModalRef<TInput, TOutput> {

    if (!this.target) {
      throw new Error('Missing modal target');
    }

    this.target.clear();
    const componentRef = this.target.createComponent(componentClass);

    const close = (outputData?: TOutput) => {
      this.target!.clear();
      this._open$.next(false);
      this._closed$.next(outputData);
    };

    const closed = () => {
      return this._closed$.event$.pipe(take(1)) as Observable<TOutput | undefined>;
    };

    const modalRef: ModalRef<TInput, TOutput> = { inputData, close, closed };
    const instance = componentRef.instance as any; // TODO: Type
    instance.modal = modalRef;

    this.cdr.detectChanges();
    this._open$.next(true);

    return modalRef;
  }
}
