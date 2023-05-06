import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

import { CheckboxComponent } from '@app/common/components/checkbox';

const IMPORTS = [
  CommonModule,
  CheckboxComponent,
];

@Component({
  selector: 'app-demo-checkbox',
  standalone: true,
  imports: IMPORTS,
  templateUrl: './checkbox.component.html',
  styles: [`
    .demo-cases {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }
  `],
})
export class CheckboxDemoPageComponent {}
