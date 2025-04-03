import { signal } from '@angular/core';
import { Observable, Subject, filter, fromEvent, takeUntil } from 'rxjs';
import { FOCUSABLE_SELECTORS } from '@common/utils';
import { KEYBOARD_KEY as KB } from '@common/types';

export type ModalKeyboardController = {
  enable: () => void;
  disable: () => void;
  canceled$: Observable<void>;
  destroy: () => void;
};

export function createModalKeyboardController(
  element: HTMLElement
): ModalKeyboardController {
  const isEnabled = signal(false);
  const stop$ = new Subject<void>();
  const canceled$ = new Subject<void>();

  function enable() {
    const firstFocusable = handleFocusTrap(element);
    handleCancelByEscape(element);
    setTimeout(() => firstFocusable?.focus(), 100);
  }

  function disable() {
    isEnabled.set(false);
    stop$.next();
  }

  function handleFocusTrap(modal: HTMLElement): HTMLElement | null {
    const focusables = modal.querySelectorAll(FOCUSABLE_SELECTORS);

    if (!focusables.length) {
      disable();
      return null;
    }

    const firstFocusable = focusables.item(0) as HTMLElement;
    const lastFocusable = focusables.item(focusables.length - 1) as HTMLElement;

    onKeydown(firstFocusable)
      .pipe(filter((event) => event.key === KB.TAB && event.shiftKey))
      .subscribe((event) => {
        stopEvent(event);
        lastFocusable?.focus();
      });

    onKeydown(lastFocusable)
      .pipe(filter((event) => event.key === KB.TAB && !event.shiftKey))
      .subscribe((event) => {
        stopEvent(event);
        firstFocusable?.focus();
      });

    return firstFocusable;
  }

  function handleCancelByEscape(modal: HTMLElement) {
    onKeydown(modal)
      .pipe(filter((event) => event.key === KB.ESC || event.key === KB.ESCAPE))
      .subscribe((event) => {
        stopEvent(event);
        canceled$.next();
      });
  }

  function onKeydown(element: HTMLElement) {
    return fromEvent<KeyboardEvent>(element, 'keydown').pipe(takeUntil(stop$));
  }

  function stopEvent(event: Event) {
    event.stopImmediatePropagation();
    event.preventDefault();
  }

  function destroy() {
    stop$.complete();
    canceled$.complete();
  }

  return {
    enable,
    disable,
    canceled$: canceled$.asObservable(),
    destroy,
  };
}
