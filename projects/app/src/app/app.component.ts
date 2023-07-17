import { AsyncPipe, NgClass, NgIf } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { RouterOutlet } from '@angular/router';
import { TranslocoModule } from '@ngneat/transloco';
import { Store } from '@ngrx/store';

import { BottomMenuComponent, LinearSpinnerComponent, ModalHostComponent, NotificationsHostComponent } from './common/components';
import { selectUiIsLoading } from './core/store';
import { UiService } from './core/ui';
import { LanguageService, ThemeService } from './core';

const imports = [
  NgIf,
  NgClass,
  AsyncPipe,
  RouterOutlet,
  MatIconModule,
  TranslocoModule,
  NotificationsHostComponent,
  ModalHostComponent,
  LinearSpinnerComponent,
  BottomMenuComponent,
];

@Component({
  selector: 'app-root',
  standalone: true,
  imports,
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {

  private store = inject(Store);
  private theme = inject(ThemeService); // Only injected for side effect
  private lang = inject(LanguageService); // Only injected for side effect

  ui = inject(UiService);
  loading = false;

  ngOnInit() {
    this.initUiLoading();
  }

  private initUiLoading(): void {
    // This guarantees no NG0100 error happens
    // "Expression has changed after it was checked"
    this.store.select(selectUiIsLoading).subscribe(loading => {
      queueMicrotask(() => this.loading = loading);
    });
  }
}
