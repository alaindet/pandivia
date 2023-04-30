import { fromEvent, tap, Observable } from 'rxjs';

import { KeyboardKey } from '@app/common/types';

type KeydownHandler = (event: KeyboardEvent) => boolean | void;

type KeydownBinder = (event: KeyboardEvent) => boolean;

type KeydownBinding = {
  on: KeyboardKey[] | KeydownBinder;
  handler: KeydownHandler;
};

type KeydownBindings = KeydownBinding[];

export function onKeydown(
  el: HTMLElement,
  bindings: KeydownBindings,
): Observable<KeyboardEvent> {

  const staticHandlers: { [key: string]: KeydownHandler } = {};
  const dynamicHandlers: [KeydownBinder, KeydownHandler][] = [];

  for (const { on, handler } of bindings) {

    if (typeof on === 'function') {
      dynamicHandlers.push([on, handler]);
      continue;
    }

    for (const keyboardKey of on) {
      staticHandlers[keyboardKey] = handler;
    }
  }

  return fromEvent<KeyboardEvent>(el, 'keydown').pipe(tap(event => {

    const onStopped = () => {
      event.stopImmediatePropagation();
      event.preventDefault();
    };

    const staticHandler = staticHandlers[event.key];

    if (!!staticHandler) {
      if (!staticHandler(event)) {
        return onStopped();
      }
    }

    if (dynamicHandlers.length) {
      for (const [on, dynamicHandler] of dynamicHandlers) {
        const shouldHandle = on(event);

        if (!shouldHandle) {
          continue;
        }

        if (!dynamicHandler(event)) {
          return onStopped();
        }
      }
    }
  }));
}