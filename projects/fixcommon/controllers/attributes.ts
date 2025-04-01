import { Renderer2, inject } from '@angular/core';

export type HTMLAttributes = Record<string, string | number | boolean>;

export class HTMLAttributesController {
  renderer = inject(Renderer2);

  apply(element: HTMLElement, attrs: HTMLAttributes | null): void {
    if (attrs === null) {
      return;
    }

    for (const [key, value] of Object.entries(attrs)) {
      switch (value) {
        case true:
          this.renderer.setAttribute(element, key, '');
          break;
        case false:
          // Do nothing
          break;
        default:
          this.renderer.setAttribute(element, key, String(value));
          break;
      }
    }
  }
}
