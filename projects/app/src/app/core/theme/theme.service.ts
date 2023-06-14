import { Injectable, computed, inject } from '@angular/core';
import { Store } from '@ngrx/store';

import { effectOnChange } from '@app/common/utils';
import { selectUiTheme, selectUiThemeOptions, uiThemeActions } from '../store/ui';
import { THEME_STORAGE_KEY, DEFAULT_THEME } from './constants';
import { Theme } from './types';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {

  private store = inject(Store);
  current = this.store.selectSignal(selectUiTheme);
  options = this.store.selectSignal(selectUiThemeOptions);
  cssClass = computed(() => `-theme-${this.current()}`);

  constructor() {
    this.initThemeFromStorage();
    this.listenToThemeChange();
  }

  change(_theme: string | null) {

    if (_theme === null) {
      this.store.dispatch(uiThemeActions.setDefaultTheme());
      return;
    }

    const theme = _theme as Theme;
    this.store.dispatch(uiThemeActions.setTheme({ theme }));
  }

  private initThemeFromStorage(): void {
    const theme = this.fetchFromStorage() ?? DEFAULT_THEME;
    console.log('Initializing theme from storage'); // TODO: Translate
    this.store.dispatch(uiThemeActions.setTheme({ theme }));
  }

  private listenToThemeChange(): void {
    effectOnChange(this.current, theme => {
      console.log('Theme changed, saving to storage'); // TODO: Translate
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