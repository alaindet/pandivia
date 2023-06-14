import { Component, OnInit, inject, signal } from '@angular/core';
import { Store } from '@ngrx/store';

import { NAVIGATION_ITEM_USER, selectUiTheme, selectUiThemeOptions, setCurrentNavigation, setCurrentTitle, uiThemeActions } from '@app/core';
import { StackedLayoutService } from '@app/common/layouts';
import { SelectComponent } from '@app/common/components';
import { Theme } from '@app/core/types';
import { selectUserEmail } from '../../store';

const IMPORTS = [
  SelectComponent,
];

@Component({
  selector: 'app-profile-page',
  standalone: true,
  imports: IMPORTS,
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfilePageComponent implements OnInit {
  
  private store = inject(Store);
  private layout = inject(StackedLayoutService);

  email = this.store.selectSignal(selectUserEmail);
  theme = this.store.selectSignal(selectUiTheme);
  themeOptions = this.store.selectSignal(selectUiThemeOptions);

  ngOnInit() {
    this.initPageMetadata();
  }

  onThemeSelected(themeSelected: string | null) {
    if (!themeSelected) {
      this.store.dispatch(uiThemeActions.setDefaultTheme());  
      return;
    }

    const theme = themeSelected as Theme;
    this.store.dispatch(uiThemeActions.setTheme({ theme }));
  }

  private initPageMetadata(): void {
    this.layout.setTitle('User Profile');
    this.layout.clearHeaderActions();
    this.store.dispatch(setCurrentTitle({ title: 'User Profile - Pandivia' }));
    this.store.dispatch(setCurrentNavigation({ current: NAVIGATION_ITEM_USER.id }));
  }
}
