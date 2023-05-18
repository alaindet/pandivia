import { Injectable, signal } from '@angular/core';

@Injectable()
export class FormFieldContextService {
  id = signal<string | null>(null);
}
