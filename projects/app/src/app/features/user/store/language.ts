import { effect, inject, signal } from '@angular/core';
import { TranslocoService } from '@jsverse/transloco';

import { DEFAULT_LANGUAGE, Language, LANGUAGE_OPTIONS, LANGUAGE_STORAGE_KEY } from '@app/core/language';
import { createLocalStorageItemController } from '@app/common/controllers';

export function createUserLanguageController() {

  const transloco = inject(TranslocoService);

  const language = signal<Language>(DEFAULT_LANGUAGE);
  const options = LANGUAGE_OPTIONS;
  const storage = createLocalStorageItemController<Language>(LANGUAGE_STORAGE_KEY, {
    serialize: lang => lang as string,
    deserialize: lang => lang as Language,
    default: DEFAULT_LANGUAGE,
  });

  function init() {
    transloco.setDefaultLang(DEFAULT_LANGUAGE);
    initLanguageFromStorage();
    onLanguageChange();
  }

  function initLanguageFromStorage(): void {
    const storedLanguage = storage.read();
    language.set(storedLanguage);
    transloco.setActiveLang(storedLanguage);
  }

  function onLanguageChange(): void {
    effect(() => {
      storage.write(language());
    });
  }

  return {
    language: language.asReadonly(),
    options,
    init,
  };
}
