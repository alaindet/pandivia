import { Observable, filter, fromEvent, takeUntil } from 'rxjs';

import { KEYBOARD_KEY } from '@app/common/types';
import { FOCUSABLE_SELECTORS } from './focusable-selectors';
import { DataSource, EventSource } from '@app/common/sources';

// TODO: https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/
export function createKeyboardFocusTrap(root: HTMLElement, signal$: Observable<void>) {

  const isEnabled$ = new DataSource<boolean>(false, signal$);
  const stop$ = new EventSource<void>(signal$);

  function enable() {
    const focusables = root.querySelectorAll(FOCUSABLE_SELECTORS);

    if (!focusables.length) {
      isEnabled$.next(false);
      stop$.next();
      return;
    }

    // Disable focus back on first focusable element
    const firstFocusable = focusables.item(0) as HTMLElement;

    // TODO
    onKeydown(firstFocusable)
      .pipe(filter(isFocusingPrevious))
      .subscribe(() => firstFocusable.focus());

    // Disable focus next on last focusable element
    const lastFocusable = focusables.item(focusables.length - 1) as HTMLElement;

    // TODO
    onKeydown(lastFocusable)
      .pipe(filter(isFocusingNext))
      .subscribe(() => lastFocusable.focus());

    // Start by focusing the first focusable item to trap the focus
    setTimeout(() => firstFocusable.focus());
  }

  function disable() {
    isEnabled$.next(false);
    stop$.next();
  }

  function isFocusingNext(event: KeyboardEvent) {
    return event.key === KEYBOARD_KEY.TAB && !event.shiftKey;
  }

  function isFocusingPrevious(event: KeyboardEvent) {
    return event.key === KEYBOARD_KEY.TAB && event.shiftKey;
  }

  function onKeydown(element: HTMLElement) {
    return fromEvent<KeyboardEvent>(element, 'keydown').pipe(
      takeUntil(signal$),
      takeUntil(stop$.event$),
    );
  }

  return {
    enable,
    disable,
  };
}