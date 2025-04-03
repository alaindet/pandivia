import { Component } from '@angular/core';
import { ButtonComponent } from '@ui/components';
import { LinearSpinnerComponent } from '@ui/components';

@Component({
  selector: 'app-demo-linear-spinner',
  imports: [LinearSpinnerComponent, ButtonComponent],
  templateUrl: './linear-spinner.component.html',
})
export class LinearSpinnerDemoPageComponent {
  inPage = false;
  fixedToViewport = false;
}
