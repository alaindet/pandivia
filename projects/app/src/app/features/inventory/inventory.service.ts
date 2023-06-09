import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { InventoryItem } from '@app/core';
import { FakeRequestConfig, MOCK_DELAY, MOCK_FAIL_RATE, MOCK_INVENTORY_ITEMS, fakeRequest } from '@app/mocks';

@Injectable({
  providedIn: 'root',
})
export class InventoryService {

  private config: FakeRequestConfig = {
    failRate: MOCK_FAIL_RATE,
    delay: MOCK_DELAY,
  };

  getItems(): Observable<InventoryItem[]> {
    return fakeRequest(MOCK_INVENTORY_ITEMS, this.config);
  }
}
