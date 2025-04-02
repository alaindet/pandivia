export function createClickOutController(
  element: HTMLElement,
  callback: () => void,
  eventName: 'click' | 'mousedown' = 'click',
) {

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
