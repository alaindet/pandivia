import { Injectable, inject } from '@angular/core';
import { Actions } from '@ngrx/effects';
import { TranslocoService } from '@ngneat/transloco';

import { createUiController } from '@app/core/store/ui';
import {
  listItemsAsyncReadActions,
  listAllItemsActions,
  listCategoryActions,
  listItemActions,
  listItemsAsyncWriteActions,
  listItemAsyncWriteActions,
} from '../actions';

@Injectable()
export class ListUiEffects {

  private actions = inject(Actions);
  private transloco = inject(TranslocoService);
  private ui = createUiController(this.actions, this.transloco);

  startLoader$ = this.ui.startLoaderOn(
    listItemsAsyncReadActions.fetchItems,
    listItemsAsyncReadActions.forceFetchItems,

    listAllItemsActions.complete,
    listAllItemsActions.undo,
    listAllItemsActions.removeCompleted,
    listAllItemsActions.remove,

    listCategoryActions.complete,
    listCategoryActions.undo,
    listCategoryActions.removeCompleted,
    listCategoryActions.remove,

    listItemActions.complete,
    listItemActions.create,
    listItemActions.decrement,
    listItemActions.edit,
    listItemActions.increment,
    listItemActions.remove,
    listItemActions.toggle,
    listItemActions.undo,
  );

  stopLoader$ = this.ui.stopLoaderOn(
    listItemsAsyncReadActions.fetchItemsSuccess,
    listItemsAsyncReadActions.fetchItemsError,
    listItemsAsyncReadActions.fetchItemsCached,

    listItemsAsyncWriteActions.editSuccess,
    listItemsAsyncWriteActions.editError,
    listItemsAsyncWriteActions.removeSuccess,
    listItemsAsyncWriteActions.removeError,

    listItemAsyncWriteActions.createSuccess,
    listItemAsyncWriteActions.createError,
    listItemAsyncWriteActions.editSuccess,
    listItemAsyncWriteActions.editError,
    listItemAsyncWriteActions.removeSuccess,
    listItemAsyncWriteActions.removeError,
  );

  showError$ = this.ui.showErrorOn(
    listItemsAsyncReadActions.fetchItemsError,

    listItemsAsyncWriteActions.editError,
    listItemsAsyncWriteActions.removeError,

    listItemAsyncWriteActions.createError,
    listItemAsyncWriteActions.editError,
    listItemAsyncWriteActions.removeError,
  );
}
