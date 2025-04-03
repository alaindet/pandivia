import { Component } from '@angular/core';
import { ButtonComponent } from '@fruit/components';
import { LinearSpinnerComponent } from '@fruit/components';

@Component({
  selector: 'app-demo-linear-spinner',
  imports: [LinearSpinnerComponent, ButtonComponent],
  templateUrl: './linear-spinner.component.html',
})
export class LinearSpinnerDemoPageComponent {
  inPage = false;
  fixedToViewport = false;
}
