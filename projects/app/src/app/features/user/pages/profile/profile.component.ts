import { Component, OnInit, inject } from '@angular/core';
import { Store } from '@ngrx/store';

import { LanguageService, NAVIGATION_ITEM_USER, uiNavigationActions, uiSetPageTitle } from '@app/core';
import { ThemeService } from '@app/core/theme';
import { StackedLayoutService } from '@app/common/layouts';
import { SelectComponent } from '@app/common/components';
import { selectUserEmail } from '../../store';

const imports = [
  SelectComponent,
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

  theme = inject(ThemeService);
  language = inject(LanguageService);
  email = this.store.selectSignal(selectUserEmail);

  ngOnInit() {
    this.initPageMetadata();
  }

  private initPageMetadata(): void {
    this.layout.setTitle('User Profile'); // TODO: Translate
    this.layout.clearHeaderActions();
    this.store.dispatch(uiSetPageTitle({ title: 'User Profile - Pandivia' })); // TODO: Translate
    const current = NAVIGATION_ITEM_USER.id;
    this.store.dispatch(uiNavigationActions.setCurrent({ current }));
  }
}
