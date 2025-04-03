import { signal } from '@angular/core';
import { BottomMenuItem } from '@ui/components';

import { NAVIGATION_ITEMS } from '../constants';

// TODO: Move
export type NavigationData = {
  items: BottomMenuItem[];
  current: BottomMenuItem['id'] | null;
};

export function createUiNavigationController() {
  const navigation = signal<NavigationData>({
    items: NAVIGATION_ITEMS,
    current: null,
  });

  function setCurrent(current: BottomMenuItem['id'] | null) {
    navigation.update((prev) => ({ ...prev, current }));
  }

  return {
    navigation: navigation.asReadonly(),
    setCurrent,
  };
}
