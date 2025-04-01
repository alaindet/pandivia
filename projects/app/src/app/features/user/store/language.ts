import { inject, signal } from '@angular/core';
import { TranslocoService } from '@jsverse/transloco';

import {
  DEFAULT_LANGUAGE,
  Language,
  LANGUAGE_OPTIONS,
  LANGUAGE_STORAGE_KEY,
} from '@app/core/language';
import { LocalStorageItem } from '@common/utils';

export function createUserLanguageController() {
  const transloco = inject(TranslocoService);

  const language = signal<Language>(DEFAULT_LANGUAGE);
  const options = LANGUAGE_OPTIONS;
  const storage = new LocalStorageItem<Language>(LANGUAGE_STORAGE_KEY, {
    serialize: (lang) => lang as string,
    deserialize: (lang) => lang as Language,
    default: DEFAULT_LANGUAGE,
  });

  function init() {
    transloco.setDefaultLang(DEFAULT_LANGUAGE);
    initLanguageFromStorage();
  }

  function initLanguageFromStorage(): void {
    const storedLanguage = storage.read();
    language.set(storedLanguage);
    transloco.setActiveLang(storedLanguage);
  }

  function set(selectedLanguage: Language | null) {
    const _language = selectedLanguage ?? DEFAULT_LANGUAGE;
    language.set(_language);
    storage.write(language());
    transloco.setActiveLang(_language);
  }

  return {
    language: language.asReadonly(),
    set,
    options,
    init,
  };
}
