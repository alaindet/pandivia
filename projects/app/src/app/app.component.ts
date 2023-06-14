import { AsyncPipe, NgClass, NgIf } from '@angular/common';
import { Component, OnInit, computed, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Store } from '@ngrx/store';

import { MatIconModule } from '@angular/material/icon';
import { BottomMenuComponent, LinearSpinnerComponent, ModalHostComponent, NotificationsHostComponent } from './common/components';
import { notificationsActions, selectNotification, selectUiIsLoading, selectUiTheme } from './core/store';

const IMPORTS = [
  NgIf,
  NgClass,
  AsyncPipe,
  RouterOutlet,
  NotificationsHostComponent,
  ModalHostComponent,
  LinearSpinnerComponent,
  BottomMenuComponent,
  MatIconModule,
];

@Component({
  selector: 'app-root',
  standalone: true,
  imports: IMPORTS,
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {

  private store = inject(Store);
  private uiTheme = this.store.selectSignal(selectUiTheme);

  loading = false;
  notification$ = this.store.select(selectNotification);
  cssTheme = computed(() => `-theme-${this.uiTheme()}`);

  ngOnInit() {
    // This guarantees no NG0100 error happens
    // "Expression has changed after it was checked"
    this.store.select(selectUiIsLoading)
      .subscribe(loading => queueMicrotask(() => this.loading = loading));
  }

  onDismissNotification() {
    this.store.dispatch(notificationsActions.dismiss());
  }
}
