import { Component, HostBinding, inject, input } from '@angular/core';
import { MediaQueryService } from '@app/common/services';

@Component({
  selector: 'app-demo-header',
  standalone: true,
  template: `
    <h1><ng-content></ng-content></h1>
    <div>Pandivia Demo v{{ version() }}</div>
  `,
  styles: [`
    :host {
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;

      &.-mobile {
        align-items: flex-start;
        flex-direction: column;
        gap: 0.3rem;
      }
    }

    h1 {
      margin: 0;
    }
  `],
})
export class DemoHeaderComponent {

  version = input.required<string>();

  isMobile = inject(MediaQueryService).getFromMobileDown();

  @HostBinding('class.-mobile')
  get cssClassMobile() {
    return this.isMobile();
  }
}
