import { Component, OnInit, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { RouterOutlet } from '@angular/router';
import { TranslocoModule } from '@jsverse/transloco';
import { Store } from '@ngrx/store';

import { BottomMenuComponent, LinearSpinnerComponent, ModalHostComponent, NotificationsHostComponent } from './common/components';
import { selectUiIsLoading } from './core/store';
import { SoftwareUpdateService } from './core/sw-update';
import { UiService } from './core/ui';

const imports = [
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
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {

  private store = inject(Store);
  private swUpdate = inject(SoftwareUpdateService);

  ui = inject(UiService);
  themeConfig = this.ui.theme.config;
  loading = this.store.selectSignal(selectUiIsLoading);

  ngOnInit() {
    this.swUpdate.check();
  }
}
