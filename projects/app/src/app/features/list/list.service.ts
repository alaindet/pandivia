import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { ListItem } from '@app/core';
import { FakeRequestConfig, MOCK_DELAY, MOCK_FAIL_RATE, MOCK_LIST_ITEMS, fakeRequest } from '@app/mocks';

@Injectable({
  providedIn: 'root',
})
export class ListService {

  private config: FakeRequestConfig = {
    failRate: MOCK_FAIL_RATE,
    delay: MOCK_DELAY,
  };

  getItems(): Observable<ListItem[]> {
    return fakeRequest(MOCK_LIST_ITEMS, this.config);
  }
}
