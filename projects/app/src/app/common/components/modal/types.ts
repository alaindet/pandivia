export type ModalTemplateInput<T extends any> = {
  $implicit: T;
};

export type ModalConfig = {
  withFooterControls: boolean;
  // ...
};

export type ModalRef<TOutput extends any> = {
  closed: Promise<TOutput | undefined>,
  close: (data?: TOutput) => void;
};
