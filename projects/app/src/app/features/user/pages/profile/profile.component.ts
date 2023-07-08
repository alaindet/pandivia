import { Component, OnInit, inject } from '@angular/core';
import { DatePipe, NgIf } from '@angular/common';
import { Store } from '@ngrx/store';
import { TranslocoModule, TranslocoService } from '@ngneat/transloco';

import { LanguageService, NAVIGATION_ITEM_USER, uiNavigationActions, uiSetPageTitle } from '@app/core';
import { environment } from '@app/environment';
import { ThemeService } from '@app/core/theme';
import { StackedLayoutService } from '@app/common/layouts';
import { ButtonComponent, SelectComponent } from '@app/common/components';
import { selectUserDisplayData, userSignOutActions } from '../../store';

const imports = [
  NgIf,
  DatePipe,
  TranslocoModule,
  SelectComponent,
  ButtonComponent,
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

  ngOnInit() {
    this.initPageMetadata();
    this.resetHeaderActions();
  }

  onSignOut() {
    this.store.dispatch(userSignOutActions.signOut());
  }

  private initPageMetadata(): void {
    const headerTitle = this.transloco.translate('userProfile.title');
    this.layout.setTitle(headerTitle);
    const title = `${headerTitle} - ${environment.appName}`;
    this.store.dispatch(uiSetPageTitle({ title }));
    const current = NAVIGATION_ITEM_USER.id;
    this.store.dispatch(uiNavigationActions.setCurrent({ current }));
  }

  private resetHeaderActions(): void {
    this.layout.setHeaderActions([]);
  }
}
