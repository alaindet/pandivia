import { Observable } from 'rxjs';

import { DataSource } from '../../../sources';

export type StackedLayoutTitleViewModel = string;

export function createTitleController(destroy$: Observable<void>) {

  const data = new DataSource<StackedLayoutTitleViewModel>('', destroy$);

  function set(title: string) {
    data.next(title);
  }

  return {
    data: data.data$,
    set,
  };
}
