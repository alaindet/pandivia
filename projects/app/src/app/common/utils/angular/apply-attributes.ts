import { Renderer2, inject } from '@angular/core';

export type ElementAttributes = { [attrName: string]: string | number | boolean};

export function applyAttributes(
  element: HTMLElement,
  attributes: ElementAttributes | null,
): void {

  if (!attributes) {
    return;
  }

  const renderer = inject(Renderer2);

  for (const [key, value] of Object.entries(attributes)) {
    switch (value) {
      case true:
        renderer.setAttribute(element, key, '');
        break;
      case false:
        // Do nothing
        break;
      default:
        renderer.setAttribute(element, key, String(value));
        break;
    }
  }
}