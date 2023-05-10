import { JsonPipe } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { QuickNumberComponent } from '@app/common/components';

const IMPORTS = [
  JsonPipe,
  ReactiveFormsModule,
  QuickNumberComponent,
];

@Component({
  selector: 'app-demo-quick-number',
  standalone: true,
  imports: IMPORTS,
  templateUrl: './quick-number.component.html',
})
export class QuickNumberDemoPageComponent {

  min = 1;
  max = 10;
  value = 5;
  consoleLog = console.log;

  myForm = new FormGroup({
    myQuickNumber: new FormControl(1, [Validators.required]),
  });
}
