import { Observable, Subject, filter, first, fromEvent, takeUntil } from 'rxjs';

import { FOCUSABLE_SELECTORS } from '@app/common/utils';
import { KEYBOARD_KEY as KB } from '@app/common/types';
import { signal } from '@angular/core';

export type ModalKeyboardController = {
  enable: () => void;
  disable: () => void;
  canceled$: Observable<void>;
  destroy: () => void;
};

export function createModalKeyboardController(
  element: HTMLElement,
): ModalKeyboardController {

  const isEnabled = signal(false);
  const stop$ = new Subject<void>();
  const canceled$ = new Subject<void>();

  function enable() {

    // TODO: Remove
    console.log('Enabling keyboard control on element', element);

    const firstFocusable = handleFocusTrap(element);
    handleCancelByEscape(element);
    setTimeout(() => {

      // TODO: Remove
      console.log('Focusing first focusable element in modal', firstFocusable);
      firstFocusable?.focus();

    }, 100);
  }

  function disable() {

    // TODO: Remove
    console.log('Disabling keyboard control');

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
      .pipe(filter(event => event.key === KB.TAB && event.shiftKey))
      .subscribe(event => {
        stopEvent(event);
        lastFocusable?.focus();
      });

    onKeydown(lastFocusable)
      .pipe(filter(event => event.key === KB.TAB && !event.shiftKey))
      .subscribe(event => {
        stopEvent(event);
        firstFocusable?.focus();
      });

    return firstFocusable;
  }

  function handleCancelByEscape(modal: HTMLElement) {
    onKeydown(modal)
      .pipe(filter(event => event.key === KB.ESC || event.key === KB.ESCAPE))
      .subscribe(event => {
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
