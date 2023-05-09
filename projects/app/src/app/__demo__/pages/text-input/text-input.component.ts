import { Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { TextInputComponent } from '@app/common/components';

const IMPORTS = [
  ReactiveFormsModule,
  TextInputComponent,
];

@Component({
  selector: 'app-demo-text-input',
  standalone: true,
  imports: IMPORTS,
  templateUrl: './text-input.component.html',
})
export class TextInputDemoPageComponent {
  // ...
}
