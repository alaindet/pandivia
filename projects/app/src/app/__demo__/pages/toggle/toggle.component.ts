import { JsonPipe } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { FORM_FIELD_EXPORTS, ToggleComponent } from '@app/common/components';

const IMPORTS = [
  JsonPipe,
  ReactiveFormsModule,
  ToggleComponent,
  ...FORM_FIELD_EXPORTS,
];

@Component({
  selector: 'app-demo-toggle',
  standalone: true,
  imports: IMPORTS,
  templateUrl: './toggle.component.html',
  styles: [`
    .demo-cases {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .demo-cage {
      width: clamp(200px, 50vw, 90vw);
      border: 2px dashed black;
      padding: 1rem;
    }
  `],
})
export class ToggleDemoPageComponent {

  outsideForm = true;

  myForm = new FormGroup({
    myToggle1: new FormControl(false, [Validators.required]),
    myToggle2: new FormControl(true, [Validators.required]),
  });

  onOutsideFormChanged(checked: boolean) {
    console.log('onOutsideFormChanged', checked);
    this.outsideForm = checked;
  }
}
