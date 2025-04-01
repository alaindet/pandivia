import { fromEvent, tap, Observable, takeUntil } from 'rxjs';
import { KeyboardKey } from '@common/types';

export type KeydownHandler = (event: KeyboardEvent) => boolean | void;

export type KeydownBinder = (event: KeyboardEvent) => boolean;

export type KeydownBinding = {
  on: KeyboardKey[] | KeydownBinder;
  handler: KeydownHandler;
};

type KeydownBindings = KeydownBinding[];

type KeydownShortcutBinding = [KeydownBinding['on'], KeydownHandler];

type KeydownShortcutBindings = KeydownShortcutBinding[];

export function onKeydown(
  el: HTMLElement,
  destroy$: Observable<void>,
  rawBindings: KeydownBindings | KeydownShortcutBindings
): Observable<KeyboardEvent> {
  if (!rawBindings.length) {
    throw new Error('No keydown bindings provided');
  }

  const staticHandlers: { [key: string]: KeydownHandler } = {};
  const dynamicHandlers: [KeydownBinder, KeydownHandler][] = [];

  let bindings!: KeydownBindings;

  // Shortcut bindings?
  if (!(rawBindings[0] as KeydownBinding)?.on) {
    const shortcuts = rawBindings as KeydownShortcutBindings;
    bindings = shortcuts.map(([on, handler]) => ({ on, handler }));
  } else {
    bindings = rawBindings as KeydownBindings;
  }

  for (const { on, handler } of bindings) {
    if (typeof on === 'function') {
      dynamicHandlers.push([on, handler]);
      continue;
    }

    for (const keyboardKey of on) {
      staticHandlers[keyboardKey] = handler;
    }
  }

  return fromEvent<KeyboardEvent>(el, 'keydown').pipe(
    takeUntil(destroy$),
    tap((event) => {
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
    })
  );
}
