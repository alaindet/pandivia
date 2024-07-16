import { effect, inject, Injectable } from '@angular/core';
import { TranslocoService } from '@jsverse/transloco';

import { createLocalStorageItemController } from '@app/common/controllers';
import { UserStoreFeatureService } from '@app/features/user/store';
import { DEFAULT_LANGUAGE, LANGUAGE_OPTIONS, LANGUAGE_STORAGE_KEY } from './constants';
import { Language } from './types';

@Injectable({
  providedIn: 'root',
})
export class LanguageService {

  private userStore = inject(UserStoreFeatureService);
  private transloco = inject(TranslocoService);
  current = this.userStore.language;
  options = LANGUAGE_OPTIONS;

  storage = createLocalStorageItemController<Language>(LANGUAGE_STORAGE_KEY, {
    serialize: lang => lang as string,
    deserialize: lang => lang as Language,
    default: DEFAULT_LANGUAGE,
  });

  constructor() {
    this.transloco.setDefaultLang(DEFAULT_LANGUAGE);
    this.initLanguageFromStorage();
    this.listenToLanguageChange();
  }

  set(_language: string | null) {
    const language = (_language ?? DEFAULT_LANGUAGE) as Language;
    this.userStore.language.set(language);
    this.transloco.setActiveLang(language);
  }

  private initLanguageFromStorage(): void {
    const language = this.storage.read();
    this.userStore.language.set(language);
    this.transloco.setActiveLang(language);
  }

  private listenToLanguageChange(): void {
    effect(() => {
      const language = this.current();
      this.storage.write(language);
    });
  }
}
