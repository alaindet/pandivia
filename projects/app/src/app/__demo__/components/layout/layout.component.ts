import { Component, HostBinding, inject, OnInit, signal } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';

import { ButtonComponent } from '@app/common/components';
import { MediaQueryService } from '@app/common/services';

const imports = [
  MatIconModule,
  ButtonComponent,
];

@Component({
  selector: 'app-demo-layout',
  standalone: true,
  imports,
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss',
})
export class DemoLayoutComponent implements OnInit {

  private router = inject(Router);

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
    const navigated$ = this.router.events.pipe(filter(e => e instanceof NavigationEnd));
    navigated$.subscribe(() => this.closeMenu());
  }

  closeMenu() {
    this.isOpen.set(false);
  }

  openMenu() {
    this.isOpen.set(true);
  }
}
