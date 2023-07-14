import { Injectable, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { TranslocoService } from '@ngneat/transloco';

import { effectOnChange } from '@app/common/utils';
import { userSetLanguage, userFallbackToDefaultLanguage } from '@app/features/user/store/actions';
import {  selectUserLanguage } from '@app/features/user/store';
import { LANGUAGE, Language } from './types';
import { DEFAULT_LANGUAGE, LANGUAGE_OPTIONS, LANGUAGE_STORAGE_KEY } from './constants';

@Injectable({
  providedIn: 'root',
})
export class LanguageService {

  private store = inject(Store);
  private transloco = inject(TranslocoService);
  current = this.store.selectSignal(selectUserLanguage);
  options = LANGUAGE_OPTIONS;

  constructor() {
    this.initLanguageFromStorage();
    this.listenToLanguageChange();
  }

  getCurrent(): Language {
    return LANGUAGE.ENGLISH;
  }

  set(_language: string | null) {

    if (_language === null) {
      this.store.dispatch(userFallbackToDefaultLanguage());
      this.transloco.setDefaultLang(DEFAULT_LANGUAGE);
      return;
    }

    const language = _language as Language;
    this.store.dispatch(userSetLanguage({ language }));
    this.transloco.setActiveLang(language);
  }

  private initLanguageFromStorage(): void {
    const language = this.fetchFromStorage() ?? DEFAULT_LANGUAGE;
    this.store.dispatch(userSetLanguage({ language }));
    this.transloco.setActiveLang(language);
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
