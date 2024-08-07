import { DatePipe } from '@angular/common';
import { Component, OnInit, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslocoModule, TranslocoService } from '@jsverse/transloco';

import { ButtonComponent, SelectComponent } from '@app/common/components';
import { StackedLayoutService } from '@app/common/layouts';
import { NAVIGATION_ITEM_USER, UiStore } from '@app/core/ui';
import { environment } from '@app/environment';
import { InviteUserComponent } from '../../components';
import { UserStore } from '../../store';
import { Theme } from '@app/core/theme';
import { Language } from '@app/core/language';

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
