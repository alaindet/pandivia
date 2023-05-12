import { JsonPipe } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { SelectComponent } from '@app/common/components';
import { FormOption } from '@app/common/types';

const IMPORTS = [
  JsonPipe,
  ReactiveFormsModule,
  SelectComponent,
];

@Component({
  selector: 'app-demo-select',
  standalone: true,
  imports: IMPORTS,
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
