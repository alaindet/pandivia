import { Injectable, computed, inject } from '@angular/core';
import { Store } from '@ngrx/store';

import { effectOnChange } from '@app/common/utils';
import { selectUiTheme, uiSetTheme, uiFallbackToDefaultTheme } from '../store/ui';
import { THEME_STORAGE_KEY, DEFAULT_THEME, THEME_OPTIONS } from './constants';
import { Theme } from './types';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {

  private store = inject(Store);
  current = this.store.selectSignal(selectUiTheme);
  options = THEME_OPTIONS;
  cssClass = computed(() => `-theme-${this.current()}`);

  constructor() {
    this.initThemeFromStorage();
    this.listenToThemeChange();
  }

  set(_theme: string | null) {

    if (_theme === null) {
      this.store.dispatch(uiFallbackToDefaultTheme());
      return;
    }

    const theme = _theme as Theme;
    this.store.dispatch(uiSetTheme({ theme }));
  }

  private initThemeFromStorage(): void {
    const theme = this.fetchFromStorage() ?? DEFAULT_THEME;
    this.store.dispatch(uiSetTheme({ theme }));
  }

  private listenToThemeChange(): void {
    effectOnChange(this.current, theme => {
      this.saveToStorage(theme);
    });
  }

  private fetchFromStorage(): Theme | null {
    const input = window.localStorage.getItem(THEME_STORAGE_KEY);
    return input ? input as Theme : null;
  }

  private saveToStorage(theme: Theme): void {
    window.localStorage.setItem(THEME_STORAGE_KEY, theme);
  }
}
