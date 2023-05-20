import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

import { MOCK_ITEMS } from '@app/mocks';

@Injectable({
  providedIn: 'root',
})
export class ListService {

  getItems(): Observable<any> {
    return of(MOCK_ITEMS);
  }
}
