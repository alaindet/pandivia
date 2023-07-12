import { Injectable } from '@angular/core';

import { createListAllItemsController } from './all-items.controller';
import { createListCategoryItemsController } from './category.controller';
import { createListItemController } from './item.controller';

@Injectable({
  providedIn: 'root',
})
export class ListService {
  allItems = createListAllItemsController();
  categoryItems = createListCategoryItemsController();
  item = createListItemController();
}
