import { JsonPipe } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { SelectComponent } from '@ui/components/select';

import { FormOption } from '@fixcommon/types';

@Component({
  selector: 'app-demo-select',
  imports: [JsonPipe, ReactiveFormsModule, SelectComponent],
  templateUrl: './select.component.html',
})
export class SelectDemoPageComponent {
  consoleLog = console.log;

  options: FormOption<string>[] = [
    { value: 'foo', label: 'Foo' },
    { value: 'bar', label: 'Bar' },
    { value: 'baz', label: 'Baz' },
    { value: 'qex', label: 'Qex' },
  ];

  myForm = new FormGroup({
    mySelected: new FormControl('baz', [Validators.required]),
    myNotSelected: new FormControl(null, [Validators.required]),
  });
}
