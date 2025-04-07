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
} from '@ui/components';
import { FormFieldComponent, FormFieldLabelComponent } from '@ui/components';
import { TextInputComponent } from '@ui/components';
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
    const _query = query.toLowerCase();
    const filteredOptions = this.options.filter((opt) => {
      if (opt.id.toLowerCase().includes(_query)) {
        return true;
      }
      if (opt.word.toLowerCase().includes(_query)) {
        return true;
      }
      return false;
    });
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
