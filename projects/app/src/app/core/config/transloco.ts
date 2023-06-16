import { HttpClient } from '@angular/common/http';
import { Injectable, inject, isDevMode } from '@angular/core';
import { provideTransloco, translocoConfig, Translation } from '@ngneat/transloco';
import { DEFAULT_LANGUAGE, LANGUAGE_OPTIONS } from '../language';

@Injectable({
  providedIn: 'root',
})
export class TranslocoHttpLoader implements TranslocoHttpLoader {

  private http = inject(HttpClient);

  getTranslation(lang: string) {
    const url = `/assets/i18n/${lang}.json`;
    return this.http.get<Translation>(url);
  }
}

export const TRANSLOCO_PROVIDERS = [
  provideTransloco({
    loader: TranslocoHttpLoader,
    config: translocoConfig({
      availableLangs: LANGUAGE_OPTIONS.map(lang => lang.value),
      defaultLang: DEFAULT_LANGUAGE,
      reRenderOnLangChange: true,
      prodMode: !isDevMode(),
      failedRetries: 1,
    }),
  }),
];
