import { Component } from '@angular/core';
import { ButtonComponent } from '@ui/components/button';
import { LinearSpinnerComponent } from '@ui/components/linear-spinner';

@Component({
  selector: 'app-demo-linear-spinner',
  imports: [LinearSpinnerComponent, ButtonComponent],
  templateUrl: './linear-spinner.component.html',
})
export class LinearSpinnerDemoPageComponent {
  inPage = false;
  fixedToViewport = false;
}
