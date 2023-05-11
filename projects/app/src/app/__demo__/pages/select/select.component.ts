import { JsonPipe } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { SelectComponent } from '@app/common/components';

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

  myForm = new FormGroup({
    mySelected: new FormControl(null, [Validators.required]),
    myNotSelected: new FormControl(null, [Validators.required]),
  });
}
