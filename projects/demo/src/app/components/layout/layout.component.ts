import { Component, inject, OnInit, signal } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';
import { NgIcon } from '@ng-icons/core';
import { matClose, matMenu } from '@ng-icons/material-icons/baseline';

import { ButtonComponent, IconButtonComponent } from '@ui/components';
import { MediaQueryService } from '@ui/services';

@Component({
  selector: 'demo-layout',
  imports: [NgIcon, ButtonComponent, IconButtonComponent],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.css',
  host: {
    '[class.-mobile]': 'isMobile()',
    '[class.-open]': 'isOpen()',
  },
})
export class DemoLayoutComponent implements OnInit {
  private router = inject(Router);

  icon = { matClose, matMenu };

  isMobile = inject(MediaQueryService).getFromMobileDown();
  isOpen = signal(false);

  ngOnInit() {
    this.closeMenuOnNavigation();
  }

  closeMenu() {
    this.isOpen.set(false);
  }

  openMenu() {
    this.isOpen.set(true);
  }

  private closeMenuOnNavigation() {
    this.router.events
      .pipe(filter((e) => e instanceof NavigationEnd))
      .subscribe(() => this.closeMenu());
  }
}
