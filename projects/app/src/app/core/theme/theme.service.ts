import { Inject, Injectable, computed, effect, inject } from '@angular/core';
import { Store } from '@ngrx/store';

import { DOCUMENT } from '@angular/common';
import { createLocalStorageItemController } from '@app/common/controllers';
import { selectUiTheme, uiSetTheme } from '../ui/store';
import { DEFAULT_THEME, THEME_OPTIONS, THEME_STORAGE_KEY, THEME_CONFIG } from './constants';
import { Theme, ThemeConfig } from './types';
import { Meta } from '@angular/platform-browser';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {

  private store = inject(Store);
  private meta = inject(Meta);
  current = this.store.selectSignal(selectUiTheme);
  config = computed<ThemeConfig>(() => THEME_CONFIG[this.current()]);
  options = THEME_OPTIONS;

  storage = createLocalStorageItemController<Theme>(THEME_STORAGE_KEY, {
    serialize: theme => theme as string,
    deserialize: theme => theme as Theme,
    default: DEFAULT_THEME,
  });

  // TODO: Is there a better way?
  constructor(
    @Inject(DOCUMENT) private document: Document,
  ) {
    this.document.body.setAttribute('theme', DEFAULT_THEME);
    this.initThemeFromStorage();
    this.listenToThemeChange();
  }

  set(_theme: string | null) {
    const theme = (_theme ?? DEFAULT_THEME) as Theme;
    this.store.dispatch(uiSetTheme({ theme }));
  }

  private initThemeFromStorage(): void {
    const theme = this.storage.read();
    this.store.dispatch(uiSetTheme({ theme }));
  }

  private listenToThemeChange(): void {
    effect(() => {
      const theme = this.current();
      this.storage.write(theme);
      const config = THEME_CONFIG[theme];
      this.document.body.setAttribute('theme', theme);
      this.meta.updateTag({ name: 'theme-color', content: config.themeColor });
    });
  }
}
