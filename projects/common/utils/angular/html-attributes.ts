import { Renderer2, inject } from '@angular/core';

export class HTMLAttributes {
  renderer = inject(Renderer2);

  apply(
    element: HTMLElement,
    attrs: null | Record<string, string | number | null | boolean>
  ): void {
    if (attrs === null) {
      return;
    }

    for (const [key, value] of Object.entries(attrs)) {
      switch (value) {
        case true:
          this.renderer.setAttribute(element, key, '');
          break;
        case false:
        case null:
          // Do nothing
          break;
        default:
          this.renderer.setAttribute(element, key, String(value));
          break;
      }
    }
  }
}
