import { computed, effect, inject, signal } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { Meta } from '@angular/platform-browser';

import { createLocalStorageItemController } from '@app/common/controllers';
import { DEFAULT_THEME, Theme, THEME_CONFIG, THEME_STORAGE_KEY } from '@app/core/theme';

export function createUiThemeController() {

  const document = inject(DOCUMENT);
  const meta = inject(Meta);

  const theme = signal<Theme>(DEFAULT_THEME);
  const config = computed(() => THEME_CONFIG[theme()]);
  const storage = createLocalStorageItemController<Theme>(THEME_STORAGE_KEY, {
    serialize: theme => theme as string,
    deserialize: theme => theme as Theme,
    default: DEFAULT_THEME,
  });

  function init() {
    document.body.setAttribute('theme', DEFAULT_THEME);
    initThemeFromStorage();
    onThemeChange();
  }

  function set(_theme?: Theme) {
    theme.set(_theme ?? DEFAULT_THEME);
  }

  function initThemeFromStorage(): void {
    theme.set(storage.read());
  }

  function onThemeChange(): void {
    effect(() => {screenTop
      const _theme = theme();
      const _config = config();
      storage.write(_theme);
      document.body.setAttribute('theme', _theme);
      meta.updateTag({ name: 'theme-color', content: _config.themeColor });
    });
  }

  return {
    theme: theme.asReadonly(),
    config,
    set,
    init,
  };
}
