import { Component, OnInit, inject } from '@angular/core';
import { Store } from '@ngrx/store';

import { NAVIGATION_ITEM_USER, setCurrentNavigation, setCurrentTitle } from '@app/core';
import { ThemeService } from '@app/core/theme';
import { StackedLayoutService } from '@app/common/layouts';
import { SelectComponent } from '@app/common/components';
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

  theme = inject(ThemeService);
  email = this.store.selectSignal(selectUserEmail);

  ngOnInit() {
    this.initPageMetadata();
  }

  private initPageMetadata(): void {
    this.layout.setTitle('User Profile');
    this.layout.clearHeaderActions();
    this.store.dispatch(setCurrentTitle({ title: 'User Profile - Pandivia' }));
    this.store.dispatch(setCurrentNavigation({ current: NAVIGATION_ITEM_USER.id }));
  }
}
