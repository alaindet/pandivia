import { Injectable, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { TranslocoService } from '@ngneat/transloco';

import { effectOnChange } from '@app/common/utils';
import { userSetLanguage } from '@app/features/user/store/actions';
import { selectUserLanguage } from '@app/features/user/store';
import { Language } from './types';
import { DEFAULT_LANGUAGE, LANGUAGE_OPTIONS, LANGUAGE_STORAGE_KEY } from './constants';
import { createLocalStorageItemController } from '@app/common/controllers';

@Injectable({
  providedIn: 'root',
})
export class LanguageService {

  private store = inject(Store);
  private transloco = inject(TranslocoService);
  current = this.store.selectSignal(selectUserLanguage);
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
    this.store.dispatch(userSetLanguage({ language }));
    this.transloco.setActiveLang(language);
  }

  private initLanguageFromStorage(): void {
    const language = this.storage.read();
    this.store.dispatch(userSetLanguage({ language }));
    this.transloco.setActiveLang(language);
  }

  private listenToLanguageChange(): void {
    effectOnChange(this.current, language => {
      this.storage.write(language);
    });
  }
}
