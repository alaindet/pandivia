export type ClickOutControllerOptions = {
  element: HTMLElement;
  callback: () => void;
  eventName: 'click' | 'mousedown';
};

export type ClickOutController = {
  start: () => void;
  stop: () => void;
};

export function createClickOutController(
  { element, callback, eventName }: ClickOutControllerOptions,
): ClickOutController {

  let abortController: AbortController | null = null;

  function start() {

    if (abortController) {
      abortController.abort();
    }

    abortController = new AbortController();
    const eventOptions = { signal: abortController.signal };
    window.addEventListener(eventName, onClick, eventOptions);
  }

  function stop() {
    if (abortController) {
      abortController.abort();
    }
  }

  function onClick(event: MouseEvent) {
    if (!element.contains(event.target as HTMLElement)) {
      callback();
      if (abortController) {
        abortController.abort();
      }
    }
  }

  return {
    start,
    stop,
  };
}
