import { computed, effect, inject, signal, DOCUMENT } from '@angular/core';

import { Meta } from '@angular/platform-browser';

import { LocalStorageItem } from '@common/utils';
import {
  DEFAULT_THEME,
  Theme,
  THEME_CONFIG,
  THEME_OPTIONS,
  THEME_STORAGE_KEY,
} from '@app/core/theme';

export function createUiThemeController() {
  const document = inject(DOCUMENT);
  const meta = inject(Meta);

  const theme = signal<Theme>(DEFAULT_THEME);
  const config = computed(() => THEME_CONFIG[theme()]);
  const storage = new LocalStorageItem<Theme>(THEME_STORAGE_KEY, {
    serialize: (theme) => theme as string,
    deserialize: (theme) => theme as Theme,
    default: DEFAULT_THEME,
  });
  const options = THEME_OPTIONS;

  function init() {
    document.body.setAttribute('theme', DEFAULT_THEME);
    initThemeFromStorage();
    onThemeChange();
  }

  function set(selectedTheme: Theme | null = null) {
    const _theme = selectedTheme ?? DEFAULT_THEME;
    theme.set(_theme);
    const _config = THEME_CONFIG[_theme];
    storage.write(_theme);
    document.body.setAttribute('theme', _theme);
    meta.updateTag({ name: 'theme-color', content: _config.themeColor });
  }

  function initThemeFromStorage(): void {
    theme.set(storage.read());
  }

  function onThemeChange(): void {
    effect(() => {
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
    options,
    set,
    init,
  };
}
