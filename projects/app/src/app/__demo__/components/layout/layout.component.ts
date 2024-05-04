import { Component, computed, HostBinding, inject, OnInit, signal } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';

import { ButtonComponent } from '@app/common/components';
import { MediaQueryService } from '@app/common/services';
import { toSignal } from '@angular/core/rxjs-interop';

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

  private mediaQuery = inject(MediaQueryService);
  private router = inject(Router);

  @HostBinding('class.-mobile')
  get cssClassMobile() {
    return this.isMobile();
  }

  @HostBinding('class.-open')
  get cssClassOpen() {
    return this.isOpen();
  }

  private mobileQuery = toSignal(this.mediaQuery.getFromMobileDown());
  isMobile = computed(() => !!this.mobileQuery());
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
