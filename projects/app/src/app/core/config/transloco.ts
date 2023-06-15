import { HttpClient } from '@angular/common/http';
import { Injectable, inject, isDevMode } from '@angular/core';
import { provideTransloco, translocoConfig, Translation } from '@ngneat/transloco';
import { AVAILABLE_LANGUAGES, DEFAULT_LANGUAGE } from '../language';

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
      availableLangs: AVAILABLE_LANGUAGES,
      defaultLang: DEFAULT_LANGUAGE,
      reRenderOnLangChange: true,
      prodMode: !isDevMode(),
      failedRetries: 1,
    }),
  }),
];
