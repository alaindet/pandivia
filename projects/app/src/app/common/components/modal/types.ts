import { Observable } from 'rxjs';

export type ModalTemplateInput<T extends any> = {
  $implicit: T;
};

export type ModalConfig = {
  withFooterControls: boolean;
  // ...
};

export type ModalRef<TInput extends any, TOutput extends any> = {
  inputData: TInput;
  closed: () => Observable<TOutput | undefined>;
  close: (outputData?: TOutput) => void;
};

export interface ModalComponent<TInput extends any> {
  data: TInput;
}
