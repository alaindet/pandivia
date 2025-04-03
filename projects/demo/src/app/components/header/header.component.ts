import { Component, HostBinding, inject, input } from '@angular/core';
import { MediaQueryService } from '@ui/services';

@Component({
  selector: 'demo-header',
  template: `
    <h1><ng-content></ng-content></h1>
    <div>Pandivia Demo v{{ version() }}</div>
  `,
  styles: [
    `
      :host {
        display: flex;
        justify-content: space-between;
        align-items: center;
        flex-wrap: wrap;
      }

      :host.-mobile {
        align-items: flex-start;
        flex-direction: column;
        gap: 0.3rem;
      }

      h1 {
        margin: 0;
      }
    `,
  ],
})
export class DemoHeaderComponent {
  version = input.required<string>();

  isMobile = inject(MediaQueryService).getFromMobileDown();

  @HostBinding('class.-mobile')
  get cssClassMobile() {
    return this.isMobile();
  }
}
