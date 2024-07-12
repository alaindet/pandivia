import { DatePipe } from '@angular/common';
import { Component, OnInit, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslocoModule, TranslocoService } from '@jsverse/transloco';
import { Store } from '@ngrx/store';

import { ButtonComponent, SelectComponent } from '@app/common/components';
import { StackedLayoutService } from '@app/common/layouts';
import { LanguageService } from '@app/core/language';
import { ThemeService } from '@app/core/theme';
import { NAVIGATION_ITEM_USER, selectUiVersion, uiSetCurrentNavigation, uiSetPageTitle } from '@app/core/ui';
import { environment } from '@app/environment';
import { InviteUserComponent } from '../../components';
import { selectUserDisplayData, selectUserIsAdmin, userSignOut } from '../../store';

const imports = [
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
  styleUrl: './profile.component.scss',
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
    this.layout.search.disable();
  }
}
