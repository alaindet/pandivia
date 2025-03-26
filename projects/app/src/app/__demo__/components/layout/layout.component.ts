import { Component, HostBinding, inject, OnInit, signal } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';
import { NgIcon } from '@ng-icons/core';
import { matClose, matMenu } from '@ng-icons/material-icons/baseline';

import { ButtonComponent, IconButtonComponent } from '@app/common/components';
import { MediaQueryService } from '@app/common/services';

@Component({
  selector: 'app-demo-layout',
  imports: [NgIcon, ButtonComponent, IconButtonComponent],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.css',
})
export class DemoLayoutComponent implements OnInit {
  private router = inject(Router);

  matMenu = matMenu;
  matClose = matClose;

  @HostBinding('class.-mobile')
  get cssClassMobile() {
    return this.isMobile();
  }

  @HostBinding('class.-open')
  get cssClassOpen() {
    return this.isOpen();
  }

  isMobile = inject(MediaQueryService).getFromMobileDown();
  isOpen = signal(false);

  ngOnInit() {
    const navigated$ = this.router.events.pipe(
      filter((e) => e instanceof NavigationEnd)
    );
    navigated$.subscribe(() => this.closeMenu());
  }

  closeMenu() {
    this.isOpen.set(false);
  }

  openMenu() {
    this.isOpen.set(true);
  }
}
