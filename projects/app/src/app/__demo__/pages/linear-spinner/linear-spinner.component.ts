import { NgIf } from '@angular/common';
import { Component } from '@angular/core';

import { ButtonComponent, LinearSpinnerComponent } from '@app/common/components';

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
