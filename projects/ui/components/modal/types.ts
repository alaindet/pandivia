import { Observable, take } from 'rxjs';
import { EnumLike } from '@common/types';

export const MODAL_OUTPUT_STATUS = {
  CANCELED: 'canceled',
  CONFIRMED: 'confirmed',
} as const;

export type ModalOutputStatus = EnumLike<typeof MODAL_OUTPUT_STATUS>;

export type ModalOutput<TOutput extends any> = {
  status: ModalOutputStatus;
  data: TOutput | undefined;
};

export type ModalRef<TInput extends any, TOutput extends any> = {
  data: TInput;
  cancel: () => void;
  canceled: () => Observable<void>;
  confirm: (data: TOutput) => void;
  confirmed: () => Observable<TOutput>;
  confirmClicked$: Observable<void>;
  closed: () => Observable<TOutput>;
};

export class BaseModalComponent<TInput extends any, TOutput extends any> {
  modal!: ModalRef<TInput, TOutput>;

  registerOnConfirm(fn: () => void) {
    this.modal.confirmClicked$.pipe(take(1)).subscribe(() => fn());
  }
}

export type ModalOptions = {
  fullPage?: boolean;
  withDefaultFooter?: boolean;
};
