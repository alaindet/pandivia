import { Component } from '@angular/core';
import { ButtonComponent } from '@ui/components/button';

import { LinearSpinnerComponent } from '@app/common/components';

@Component({
  selector: 'app-demo-linear-spinner',
  imports: [LinearSpinnerComponent, ButtonComponent],
  templateUrl: './linear-spinner.component.html',
})
export class LinearSpinnerDemoPageComponent {
  inPage = false;
  fixedToViewport = false;
}
