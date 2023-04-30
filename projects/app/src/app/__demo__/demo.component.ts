import { Component, inject } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import { DEMO_PAGES } from './routes';
import { DemoNavigationMenuComponent } from './components/navigation-menu/navigation-menu.component';
import { DemoHeaderComponent } from './components/header/header.component';
import { DemoLayoutComponent } from './components/layout/layout.component';
import { DEMO_VERSION } from './version';
import { filter, map, of, startWith, switchMap, tap } from 'rxjs';
import { Title } from '@angular/platform-browser';

const IMPORTS = [
  CommonModule,
  RouterModule,
  DemoLayoutComponent,
  DemoHeaderComponent,
  DemoNavigationMenuComponent,
];

@Component({
  selector: 'app-demo',
  standalone: true,
  imports: IMPORTS,
  template: `
    <app-demo-layout>

      <ng-container slot="header">
        <app-demo-header [version]="version">
          {{ title }}
        </app-demo-header>
      </ng-container>

      <ng-container slot="main">
        <router-outlet></router-outlet>
      </ng-container>

      <ng-container slot="aside">
        <app-demo-navigation-menu
          routePrefix="/demo"
          [routes]="pages"
        ></app-demo-navigation-menu>
      </ng-container>

    </app-demo-layout>
  `,
  styles: [`
    .router {
      margin-bottom: 2rem;
    }
  `],
})
export class DemoPageComponent {

  route = inject(ActivatedRoute);
  router = inject(Router);
  titleService = inject(Title);

  pages = DEMO_PAGES;
  version = DEMO_VERSION;
  title = 'Demo';

  ngOnInit() {
    this.router.events.pipe(
      filter(e => e instanceof NavigationEnd),
      map(() => this.router.url),
      startWith(this.router.url),
    ).subscribe(url => this.updateTitle(url));
  }

  private updateTitle(url: string): void {
    const query = url.replace('/demo', '');
    const page = this.pages.find(p => query.includes(p.path));
    const label = page?.label ?? 'Demo';
    this.titleService.setTitle(`Pandivia Demo: ${label}`);
    this.title = label;
  }
}
