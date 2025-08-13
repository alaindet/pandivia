
import { Component, inject, OnInit, DOCUMENT } from '@angular/core';
import { Title } from '@angular/platform-browser';
import {
  ActivatedRoute,
  NavigationEnd,
  Router,
  RouterOutlet,
} from '@angular/router';
import {
  LinearSpinnerComponent,
  ModalHostComponent,
  NotificationsHostComponent,
} from '@ui/components';
import { filter, map, startWith } from 'rxjs';

import { DEMO_PAGES } from './app.routes';
import { DemoHeaderComponent } from './components/header/header.component';
import { DemoLayoutComponent } from './components/layout/layout.component';
import { DemoNavigationMenuComponent } from './components/navigation-menu/navigation-menu.component';
import { UiStore } from './ui';

@Component({
  selector: 'demo-root',
  imports: [
    RouterOutlet,
    DemoLayoutComponent,
    DemoHeaderComponent,
    DemoNavigationMenuComponent,
    LinearSpinnerComponent,
    NotificationsHostComponent,
    ModalHostComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit {
  route = inject(ActivatedRoute);
  router = inject(Router);
  titleService = inject(Title);
  document = inject(DOCUMENT);
  uiStore = inject(UiStore);

  NOTIFICATION_TIMEOUT = 3_000;
  notification = this.uiStore.notifications.notification;
  loading = this.uiStore.loader.loading;
  themeConfig = this.uiStore.theme.config;
  pages = DEMO_PAGES;
  version = this.uiStore.version;
  title = this.uiStore.title.title;

  ngOnInit() {
    this.onPageChanged(this.updateTitle.bind(this));
    this.forceAppWidthToFullScreen();
  }

  onDismissNotification() {
    this.uiStore.notifications.dismiss();
  }

  private onPageChanged(fn: (url: string) => void): void {
    this.router.events
      .pipe(
        filter((e) => e instanceof NavigationEnd),
        map(() => this.router.url),
        startWith(this.router.url)
      )
      .subscribe(fn);
  }

  private updateTitle(url: string): void {
    const query = url.replace('/', '').slice(1); // Ex.: 'linear-spinner'
    const page = this.pages.find((p) => query === p.path);
    const label = page?.label ?? 'Demo';
    this.titleService.setTitle(`Pandivia Demo: ${label}`);
    this.uiStore.title.set(label);
  }

  private forceAppWidthToFullScreen(): void {
    this.document.documentElement.style.setProperty(
      '--app-width-container',
      '100vw'
    );
  }
}
