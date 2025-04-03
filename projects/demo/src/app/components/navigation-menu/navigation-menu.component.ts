import { Component, effect, input } from '@angular/core';
import { RouterModule } from '@angular/router';

import { DemoRoute } from '../../types';

@Component({
  selector: 'demo-navigation-menu',
  imports: [RouterModule],
  template: `
    <ul>
      @for (route of routes(); track route.path) {
      <li>
        <a [routerLink]="[routePrefix(), route.path]">{{ route.label }}</a>
      </li>
      }
    </ul>
  `,
  styles: [
    `
      :host {
        display: block;
        white-space: nowrap;
        width: var(--app-width-demo-navigation);
      }

      ul {
        list-style-type: none;
        margin: 0;
        padding: 0;
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
      }
    `,
  ],
})
export class DemoNavigationMenuComponent {
  routePrefix = input('');
  routes = input.required<DemoRoute[]>();

  _ = effect(() => console.log('routePrefix', this.routePrefix()));
}
