import { Renderer2, inject } from '@angular/core';

import { HTMLAttributes } from './types';

export function createAttributesController() {

  const renderer = inject(Renderer2);

  function apply(
    element: HTMLElement,
    attrs: HTMLAttributes | null,
  ): void {
    if (attrs === null) {
      return;
    }

    for (const [key, value] of Object.entries(attrs)) {

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

  return { apply };
}
