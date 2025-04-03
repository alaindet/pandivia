import { DatePipe } from '@angular/common';
import { Component, OnInit, computed, inject } from '@angular/core';
import { TranslocoModule, TranslocoService } from '@jsverse/transloco';
import { ButtonComponent } from '@fruit/components';
import { SelectComponent } from '@fruit/components';

import { StackedLayoutService } from '@app/common/layouts';
import { Language } from '@app/core/language';
import { Theme } from '@app/core/theme';
import { NAVIGATION_ITEM_USER, UiStore } from '@app/core/ui';
import { environment } from '@app/environment';
import { InviteUserComponent } from '../../components';
import { UserStore } from '../../store';

@Component({
  selector: 'app-profile-page',
  imports: [
    DatePipe,
    TranslocoModule,
    SelectComponent,
    ButtonComponent,
    InviteUserComponent,
  ],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css',
})
export class ProfilePageComponent implements OnInit {
  private uiStore = inject(UiStore);
  private userStore = inject(UserStore);
  private layout = inject(StackedLayoutService);
  private transloco = inject(TranslocoService);

  theme = this.uiStore.theme;
  language = this.userStore.language;
  userData = this.userStore.display;
  isAdmin = this.userStore.isAdmin;
  isProduction = environment.production;
  nameAndVersion = computed(() => {
    return `${environment.appName} v.${this.uiStore.version}`;
  });

  ngOnInit() {
    this.initPageMetadata();
  }

  onSignOut() {
    this.userStore.signOut();
  }

  onSelectTheme(theme: string | null) {
    this.theme.set(theme as Theme | null);
  }

  onSelectLanguage(language: string | null) {
    this.language.set(language as Language);
  }

  private initPageMetadata(): void {
    const headerTitle = this.transloco.translate('userProfile.title');
    this.layout.title.set(headerTitle);
    const title = `${headerTitle} - ${environment.appName}`;
    this.uiStore.title.set(title);

    const current = NAVIGATION_ITEM_USER.id;
    this.uiStore.navigation.setCurrent(current);
    this.layout.headerCounters.clear();
    this.layout.headerActions.clear();
    this.layout.search.disable();
  }
}
