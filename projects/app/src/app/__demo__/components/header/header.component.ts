import { Component, HostBinding, computed, inject, input } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
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

  private mediaQuery = inject(MediaQueryService);

  version = input.required<string>();

  private mobileQuery = toSignal(this.mediaQuery.getFromMobileDown());
  isMobile = computed(() => !!this.mobileQuery());


  @HostBinding('class.-mobile')
  get cssClassMobile() {
    return this.isMobile();
  }
}
