import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

import { ButtonComponent } from '@app/common/components';

@Component({
  selector: 'app-demo-button',
  imports: [ButtonComponent, MatIconModule],
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
