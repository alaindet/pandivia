import { Component } from '@angular/core';
import { JsonPipe, NgIf } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { TextInputComponent, AutocompleteComponent, AutocompleteOptionComponent, AutocompleteAsyncOptionsFn, AutocompleteOption } from '@app/common/components';
import { OPTIONS } from './options';
import { Observable, delay, of } from 'rxjs';

const IMPORTS = [
  NgIf,
  ReactiveFormsModule,
  JsonPipe,
  TextInputComponent,
  AutocompleteComponent,
  AutocompleteOptionComponent,
];

@Component({
  selector: 'app-demo-autocomplete',
  standalone: true,
  imports: IMPORTS,
  templateUrl: './autocomplete.component.html',
})
export class AutocompleteDemoPageComponent {

  consoleLog = console.log;
  options = OPTIONS;

  asyncOptions: AutocompleteAsyncOptionsFn = (
    query: string,
  ): Observable<AutocompleteOption[]> => {
    const filteredOptions = this.options.filter(opt => opt.id.includes(query));
    return of(filteredOptions).pipe(delay(2000));
  };

  theForm = new FormGroup({
    staticField: new FormControl('', [Validators.required]),
    asyncField: new FormControl('', [Validators.required]),
  });

  get fStatic(): FormControl {
    return this.theForm.get('staticField')! as FormControl;
  }

  get fAsync(): FormControl {
    return this.theForm.get('asyncField')! as FormControl;
  }
}
