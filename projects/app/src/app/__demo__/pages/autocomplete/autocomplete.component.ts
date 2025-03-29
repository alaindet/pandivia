import { Component } from '@angular/core';
import { JsonPipe } from '@angular/common';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Observable, delay, of } from 'rxjs';
import { TextInputComponent } from '@ui/components/text-input';
import {
  FormFieldComponent,
  FormFieldLabelComponent,
} from '@ui/components/form-field';
import {
  AutocompleteAsyncOptionsFn,
  AutocompleteOption,
  AUTOCOMPLETE_EXPORTS,
} from '@ui/components/autocomplete';

import { OPTIONS } from './options';

@Component({
  selector: 'app-demo-autocomplete',
  imports: [
    ReactiveFormsModule,
    JsonPipe,
    TextInputComponent,
    ...AUTOCOMPLETE_EXPORTS,
    FormFieldComponent,
    FormFieldLabelComponent,
  ],
  templateUrl: './autocomplete.component.html',
})
export class AutocompleteDemoPageComponent {
  consoleLog = console.log;
  options = OPTIONS;

  asyncOptions: AutocompleteAsyncOptionsFn = (
    query: string
  ): Observable<AutocompleteOption[]> => {
    const filteredOptions = this.options.filter((opt) =>
      opt.id.includes(query)
    );
    return of(filteredOptions).pipe(delay(800));
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
