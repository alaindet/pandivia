import { Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { QuickNumberComponent } from '@app/common/components';

const IMPORTS = [
  ReactiveFormsModule,
  QuickNumberComponent,
];

@Component({
  selector: 'app-demo-quick-number',
  standalone: true,
  imports: IMPORTS,
  templateUrl: './quick-number.component.html',
})
export class QuickNumberDemoPageComponent {
  // ...
}
