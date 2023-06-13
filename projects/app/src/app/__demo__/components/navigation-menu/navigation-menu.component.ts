import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { RouterModule } from '@angular/router';

import { DemoRoute } from '@app/__demo__/types';

const IMPORTS = [
  CommonModule,
  RouterModule,
];

@Component({
  selector: 'app-demo-navigation-menu',
  standalone: true,
  imports: IMPORTS,
  template: `
    <ul>
      <li *ngFor="let route of routes">
        <a [routerLink]="[routePrefix, route.path]">{{ route.label }}</a>
      </li>
    </ul>
  `,
  styles: [`
    @import 'scoped';

    :host {
      display: block;
      white-space: nowrap;
      width: $app-width-demo-navigation;
    }

    ul {
      list-style-type: none;
      margin: 0;
      padding: 0;
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }
  `],
})
export class DemoNavigationMenuComponent {
  @Input() routePrefix = '';
  @Input() routes: DemoRoute[] = [];
}
