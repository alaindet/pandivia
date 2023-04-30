import { Observable, combineLatest, debounceTime, startWith, switchMap } from 'rxjs';

import { filterNull } from '@app/common/rxjs';
import { ActionsMenuViewModel } from '../types';
import { ActionsMenuService } from './actions-menu.service';

export function createViewModelController(parent: ActionsMenuService) {

  const SIXTY_FRAMES_PER_SECOND = 1000 / 60;

  const vm: Observable<ActionsMenuViewModel | null> = parent.core.ready$.pipe(
    switchMap(() => combineLatest({
      templates: parent.templates.templates$,
      buttonId: parent.ids.button$.pipe(filterNull()),
      itemsId: parent.ids.items$.pipe(filterNull()),
      isOpen: parent.menu.open$,
      actions: parent.actions.actions$.pipe(filterNull()),
      focused: parent.focus.focused$,
    }).pipe(debounceTime(SIXTY_FRAMES_PER_SECOND))),
    startWith(null),
  );

  return vm;
}
