import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

import { ButtonComponent } from '@app/common/components';

const imports = [
  ButtonComponent,
  MatIconModule,
];

@Component({
  selector: 'app-demo-button',
  standalone: true,
  imports,
  templateUrl: './button.component.html',
  styleUrl: './button.component.scss',
})
export class ButtonDemoPageComponent {

  fabContainer = false;
  fabFixed = false;

  onToggleFabContainer() {
    this.fabContainer = !this.fabContainer;
  }

  onToggleFabFixed() {
    this.fabFixed = !this.fabFixed;
  }
}
