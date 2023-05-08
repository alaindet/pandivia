import { Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { QuickInputComponent } from '@app/common/components';

const IMPORTS = [
  ReactiveFormsModule,
  QuickInputComponent,
];

@Component({
  selector: 'app-demo-quick-input',
  standalone: true,
  imports: IMPORTS,
  templateUrl: './quick-input.component.html',
})
export class QuickInputDemoPageComponent {
  // ...
}
