import { Injectable, TemplateRef } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ModalService {

  showByTemplate<T extends any>(id: string, template: TemplateRef<T>, data: T) {
    // https://dev.to/railsstudent/render-ngtemplates-dynamically-using-viewcontainerref-in-angular-17lp
  }
}
