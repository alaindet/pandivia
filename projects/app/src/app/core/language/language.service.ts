import { userLanguageActions } from './../../features/user/store/actions';
import { Injectable, inject } from '@angular/core';
import { Store } from '@ngrx/store';

import { selectUserAvailableLanguages, selectUserLanguage } from '@app/features/user/store';
import { LANGUAGE, Language } from './types';
import { DEFAULT_LANGUAGE, LANGUAGE_STORAGE_KEY } from './constants';
import { effectOnChange } from '@app/common/utils';

@Injectable({
  providedIn: 'root',
})
export class LanguageService {

  private store = inject(Store);
  current = this.store.selectSignal(selectUserLanguage);
  options = this.store.selectSignal(selectUserAvailableLanguages);

  constructor() {
    this.initLanguageFromStorage();
    this.listenToLanguageChange();
  }

  getCurrent(): Language {
    return LANGUAGE.ENGLISH;
  }

  set(lang: Language) {
    // ...
  }

  private initLanguageFromStorage(): void {
    const language = this.fetchFromStorage() ?? DEFAULT_LANGUAGE;
    this.store.dispatch(userLanguageActions.setLanguage({ language }));
  }

  private listenToLanguageChange(): void {
    effectOnChange(this.current, language => {
      this.saveToStorage(language as Language);
    });
  }

  private fetchFromStorage(): Language | null {
    const input = window.localStorage.getItem(LANGUAGE_STORAGE_KEY);
    return input ? input as Language : null;
  }

  private saveToStorage(language: Language): void {
    window.localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
  }
}
