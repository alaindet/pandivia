import { Component, OnInit, computed, inject } from '@angular/core';
import { DatePipe, NgIf } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import { TranslocoModule, TranslocoService } from '@ngneat/transloco';

import { NAVIGATION_ITEM_USER, selectUiVersion, uiSetCurrentNavigation, uiSetPageTitle } from '@app/core/ui';
import { LanguageService } from '@app/core/language';
import { environment } from '@app/environment';
import { ThemeService } from '@app/core/theme';
import { StackedLayoutService } from '@app/common/layouts';
import { ButtonComponent, SelectComponent } from '@app/common/components';
import { selectUserDisplayData, selectUserIsAdmin, userSignOut } from '../../store';
import { InviteUserComponent } from '../../components';

const imports = [
  NgIf,
  DatePipe,
  RouterLink,
  TranslocoModule,
  SelectComponent,
  ButtonComponent,
  InviteUserComponent,
];

@Component({
  selector: 'app-profile-page',
  standalone: true,
  imports,
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfilePageComponent implements OnInit {

  private store = inject(Store);
  private layout = inject(StackedLayoutService);
  private transloco = inject(TranslocoService);

  theme = inject(ThemeService);
  language = inject(LanguageService);
  userData = this.store.selectSignal(selectUserDisplayData);
  isAdmin = this.store.selectSignal(selectUserIsAdmin);
  private version = this.store.selectSignal(selectUiVersion);
  nameAndVersion = computed(() => `${environment.appName} v.${this.version()}`);
  isProduction = environment.production;

  ngOnInit() {
    this.initPageMetadata();
  }

  onSignOut() {
    this.store.dispatch(userSignOut.try());
  }

  private initPageMetadata(): void {
    const headerTitle = this.transloco.translate('userProfile.title');
    this.layout.title.set(headerTitle);
    const title = `${headerTitle} - ${environment.appName}`;
    this.store.dispatch(uiSetPageTitle({ title }));
    const current = NAVIGATION_ITEM_USER.id;
    this.store.dispatch(uiSetCurrentNavigation({ current }));
    this.layout.headerCounters.clear();
    this.layout.headerActions.clear();

    // For some reason, it triggers a NG0100 error
    // https://angular.io/errors/NG0100
    queueMicrotask(() => this.layout.search.disable());
    // this.layout.search.disable();
  }
}
