import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { FakeRequestConfig, MOCK_DELAY, MOCK_FAIL_RATE, MOCK_ITEMS, fakeRequest } from '@app/mocks';
import { ListItem } from './types';

@Injectable({
  providedIn: 'root',
})
export class ListService {

  private config: FakeRequestConfig = {
    failRate: MOCK_FAIL_RATE,
    delay: MOCK_DELAY,
  };

  getItems(): Observable<ListItem[]> {
    return fakeRequest(MOCK_ITEMS, this.config);
  }
}
