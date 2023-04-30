import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { map } from 'rxjs';

import { firstNonNull } from '@app/common/rxjs';
import { ItemsService } from './items.service';

@Component({
  selector: 'app-lists',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
  ],
  templateUrl: './items.component.html',
})
export class ItemsFeatureComponent {

  svc = inject(ItemsService);
  route = inject(ActivatedRoute);
  listId = this.route.snapshot.params['listid'];

  loaded$ = this.svc.items$.data$.pipe(map(lists => lists !== null));
  items$ = this.svc.items$.data$.pipe(firstNonNull());
}
