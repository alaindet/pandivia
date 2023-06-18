import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

import { ButtonComponent } from '@app/common/components';

const imports = [
  CommonModule,
  ButtonComponent,
  MatIconModule,
];

@Component({
  selector: 'app-demo-button',
  standalone: true,
  imports,
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss'],
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
