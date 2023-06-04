import { Component, OnInit, inject } from '@angular/core';
import { Store } from '@ngrx/store';

import { NAVIGATION_ITEM_USER, setCurrentNavigation, setCurrentTitle } from '@app/core';
import { StackedLayoutService } from '@app/common/layouts';

// const IMPORTS = [
//   // ...
// ];

@Component({
  selector: 'app-profile-page',
  standalone: true,
  // imports: IMPORTS,
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfilePageComponent implements OnInit {
  
  private store = inject(Store);
  private layout = inject(StackedLayoutService);

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
