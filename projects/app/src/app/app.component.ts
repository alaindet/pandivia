import { AsyncPipe, NgClass, NgIf } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Store } from '@ngrx/store';
import { MatIconModule } from '@angular/material/icon';
import { TranslocoModule } from '@ngneat/transloco';

import { ThemeService } from './core/theme';
import { selectUiIsLoading } from './core/store';
import { UiService } from './core/ui';
import { BottomMenuComponent, LinearSpinnerComponent, ModalHostComponent, NotificationsHostComponent } from './common/components';

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
  private theme = inject(ThemeService);

  ui = inject(UiService);
  loading = false;
  cssTheme = this.theme.cssClass;

  ngOnInit() {
    // This guarantees no NG0100 error happens
    // "Expression has changed after it was checked"
    this.store.select(selectUiIsLoading)
      .subscribe(loading => queueMicrotask(() => this.loading = loading));
  }
}
