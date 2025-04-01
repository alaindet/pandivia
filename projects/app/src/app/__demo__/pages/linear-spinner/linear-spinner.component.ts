import { Component } from '@angular/core';
import { ButtonComponent } from '@fruit/components/button';
import { LinearSpinnerComponent } from '@fruit/components/linear-spinner';

@Component({
  selector: 'app-demo-linear-spinner',
  imports: [LinearSpinnerComponent, ButtonComponent],
  templateUrl: './linear-spinner.component.html',
})
export class LinearSpinnerDemoPageComponent {
  inPage = false;
  fixedToViewport = false;
}
