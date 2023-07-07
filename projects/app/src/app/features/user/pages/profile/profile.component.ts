import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { TranslocoModule, TranslocoService } from '@ngneat/transloco';

import { LanguageService, NAVIGATION_ITEM_USER, NotificationService, uiNavigationActions, uiSetPageTitle } from '@app/core';
import { environment } from '@app/environment';
import { ThemeService } from '@app/core/theme';
import { StackedLayoutService } from '@app/common/layouts';
import { ButtonComponent, SelectComponent } from '@app/common/components';
import { selectUserEmail } from '../../store';
import { AuthenticationService } from '../../services';

const imports = [
  TranslocoModule,
  SelectComponent,
  ButtonComponent,
];

@Component({
  selector: 'app-profile-page',
  standalone: true,
  imports,
  templateUrl: './profile.component.html',
})
export class ProfilePageComponent implements OnInit {

  private store = inject(Store);
  private router = inject(Router);
  private notification = inject(NotificationService);
  private auth = inject(AuthenticationService);
  private layout = inject(StackedLayoutService);
  private transloco = inject(TranslocoService);

  theme = inject(ThemeService);
  language = inject(LanguageService);
  email = this.store.selectSignal(selectUserEmail);

  ngOnInit() {
    this.initPageMetadata();
    this.resetHeaderActions();
  }

  onSignOut() {
    this.auth.signOut().subscribe({
      error: err => {
        console.error(err);
        this.notification.error('auth.signoutError');
      },
      next: () => {
        this.router.navigate(['/signin']);
        this.notification.success('auth.signoutSuccess');
      },
    });
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
