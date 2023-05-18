import { NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { ButtonComponent } from '@app/common/components';

import { LinearSpinnerComponent } from '@app/common/components/linear-spinner/linear-spinner.component';

const IMPORTS = [
  NgIf,
  LinearSpinnerComponent,
  ButtonComponent,
];

@Component({
  selector: 'app-demo-linear-spinner',
  standalone: true,
  imports: IMPORTS,
  templateUrl: './linear-spinner.component.html',
})
export class LinearSpinnerDemoPageComponent {
  inPage = false;
  fixedToViewport = false;
}
