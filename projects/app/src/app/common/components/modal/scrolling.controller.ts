export function createScrollingController(element: HTMLElement) {

  const initialOverflowY = element.style.overflowY;

  function block() {
    element.style.overflowY = 'hidden';
  }

  function restore() {
    element.style.overflowY = initialOverflowY;
  }

  return {
    block,
    restore,
  };
}

export function createBodyScrollingController() {
  return createScrollingController(document.body);
}
