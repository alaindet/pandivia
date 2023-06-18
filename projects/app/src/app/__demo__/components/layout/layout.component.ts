import { filter } from 'rxjs';
import { Component, HostBinding, inject, OnInit } from '@angular/core';
import { NgIf } from '@angular/common';
import { Router, NavigationEnd } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';

import { ButtonComponent } from '@app/common/components';
import { MediaQueryService } from '@app/common/services';

const imports = [
  NgIf,
  MatIconModule,
  ButtonComponent,
];

@Component({
  selector: 'app-demo-layout',
  standalone: true,
  imports,
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss'],
})
export class DemoLayoutComponent implements OnInit {

  private mediaQuery = inject(MediaQueryService);
  private router = inject(Router);

  @HostBinding('class.-mobile') isMobile = false;
  @HostBinding('class.-open') isOpen = false;

  ngOnInit() {

    this.mediaQuery.getFromMobileDown()
      .subscribe(isMobile => this.isMobile = isMobile);

    this.router.events.pipe(filter(e => e instanceof NavigationEnd))
      .subscribe(() => this.closeMenu());
  }

  closeMenu() {
    this.isOpen = false;
  }

  openMenu() {
    this.isOpen = true;
  }
}
