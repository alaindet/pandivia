import { FOCUSABLE_SELECTORS } from './focusable-selectors';

export function createFocusTrap(root: HTMLElement) {

  let enabled = false;
  let fn: () => void = () => {};

  function enable() {
    const focusables = root.querySelectorAll(FOCUSABLE_SELECTORS);

    if (!focusables.length) {
      return;
    }

    enabled = true;
    const firstFocusable = focusables.item(0) as HTMLElement;
    const focusTrapFn = () => firstFocusable.focus();
    fn = focusTrapFn;

    setTimeout(() => focusTrapFn());
    root.addEventListener('focusout', focusTrapFn);
  }

  function disable() {
    if (enabled) {
      enabled = false;
      root.removeEventListener('focusout', fn);
    }
  }

  return {
    enable,
    disable,
  };
}