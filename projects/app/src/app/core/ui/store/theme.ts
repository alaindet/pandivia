import { signal } from '@angular/core';

import { DEFAULT_THEME, Theme } from '@app/core/theme';

export function createUiThemeController() {
  const theme = signal<Theme>(DEFAULT_THEME);

  function set(_theme: Theme) {
    theme.set(_theme);
  }

  return {
    theme: theme.asReadonly(),
    set,
  };
}
