import { SimpleChange } from '@angular/core';

export function didInputChange(change?: SimpleChange): boolean {
	if (!change) {
    return false;
  }
	return change.firstChange || change.currentValue !== change.previousValue;
}
