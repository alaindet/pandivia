import { Component } from '@angular/core';

import { ButtonComponent, LinearSpinnerComponent } from '@app/common/components';

const imports = [
  LinearSpinnerComponent,
  ButtonComponent,
];

@Component({
  selector: 'app-demo-linear-spinner',
  standalone: true,
  imports,
  templateUrl: './linear-spinner.component.html',
})
export class LinearSpinnerDemoPageComponent {
  inPage = false;
  fixedToViewport = false;
}
