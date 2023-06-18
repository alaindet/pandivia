import { Component, OnInit, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { TranslocoModule, TranslocoService } from '@ngneat/transloco';

import { LanguageService, NAVIGATION_ITEM_USER, uiNavigationActions, uiSetPageTitle } from '@app/core';
import { environment } from '@app/environment';
import { ThemeService } from '@app/core/theme';
import { StackedLayoutService } from '@app/common/layouts';
import { SelectComponent } from '@app/common/components';
import { selectUserEmail } from '../../store';

const imports = [
  TranslocoModule,
  SelectComponent,
];

@Component({
  selector: 'app-profile-page',
  standalone: true,
  imports,
  templateUrl: './profile.component.html',
})
export class ProfilePageComponent implements OnInit {

  private store = inject(Store);
  private layout = inject(StackedLayoutService);
  private transloco = inject(TranslocoService);

  theme = inject(ThemeService);
  language = inject(LanguageService);
  email = this.store.selectSignal(selectUserEmail);

  ngOnInit() {
    this.initPageMetadata();
  }

  private initPageMetadata(): void {
    const headerTitle = this.transloco.translate('userProfile.title');
    this.layout.setTitle(headerTitle);
    const title = `${headerTitle} - ${environment.appName}`;
    this.store.dispatch(uiSetPageTitle({ title }));
    const current = NAVIGATION_ITEM_USER.id;
    this.store.dispatch(uiNavigationActions.setCurrent({ current }));
  }
}
