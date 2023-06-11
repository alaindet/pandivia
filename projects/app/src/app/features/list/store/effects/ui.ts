import { Injectable, inject } from '@angular/core';
import { Actions } from '@ngrx/effects';

import { createUiController } from '@app/core/store/ui';
import * as fromActions from '../actions';

@Injectable()
export class ListUiEffects {

  private actions = inject(Actions);
  private ui = createUiController(this.actions);

  startLoader$ = this.ui.startLoaderOn(
    fromActions.listItemsAsyncReadActions.fetchItems,
    fromActions.listItemsAsyncReadActions.forceFetchItems,
    fromActions.listAllItemsActions.complete,
    fromActions.listAllItemsActions.undo,
    fromActions.listCategoryActions.complete,
    fromActions.listCategoryActions.undo,
    fromActions.listAllItemsActions.removeCompleted,
    fromActions.listAllItemsActions.remove,
    fromActions.listCategoryActions.removeCompleted,
    fromActions.listCategoryActions.remove,
  );

  stopLoader$ = this.ui.stopLoaderOn(
    fromActions.listItemsAsyncReadActions.fetchItemsSuccess,
    fromActions.listItemsAsyncReadActions.fetchItemsError,
    fromActions.listItemsAsyncReadActions.fetchItemsCached,
    fromActions.listItemsAsyncWriteActions.editSuccess,
    fromActions.listItemsAsyncWriteActions.editError,
    fromActions.listItemsAsyncWriteActions.removeSuccess,
    fromActions.listItemsAsyncWriteActions.removeError,
    fromActions.listItemAsyncWriteActions.createSuccess,
    fromActions.listItemAsyncWriteActions.createError,
    fromActions.listItemAsyncWriteActions.editSuccess,
    fromActions.listItemAsyncWriteActions.editError,
    fromActions.listItemAsyncWriteActions.removeSuccess,
    fromActions.listItemAsyncWriteActions.removeError,
  );

  showError$ = this.ui.showErrorOn(
    fromActions.listItemsAsyncReadActions.fetchItemsError,
    fromActions.listItemsAsyncWriteActions.editError,
    fromActions.listItemsAsyncWriteActions.removeError,
    fromActions.listItemAsyncWriteActions.createError,
    fromActions.listItemAsyncWriteActions.editError,
    fromActions.listItemAsyncWriteActions.removeError,
  );
}
