import { JsonPipe } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  AutocompleteComponent,
  AutocompleteOptionDirective,
  AutocompleteAsyncOptionsFn,
  AutocompleteOption,
} from '@fruit/components/autocomplete';
import {
  FormFieldComponent,
  FormFieldLabelComponent,
} from '@fruit/components/form-field';
import { TextInputComponent } from '@fruit/components/text-input';
import { Observable, delay, of } from 'rxjs';

import { OPTIONS } from './options';

@Component({
  selector: 'app-demo-autocomplete',
  imports: [
    ReactiveFormsModule,
    JsonPipe,
    TextInputComponent,
    AutocompleteComponent,
    AutocompleteOptionDirective,
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
