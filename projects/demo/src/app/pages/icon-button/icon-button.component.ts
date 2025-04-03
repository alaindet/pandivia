import { Component } from '@angular/core';
import { NgIcon } from '@ng-icons/core';
import {
  matAdd,
  matClear,
  matSchedule,
  matSearch,
  matPhone,
} from '@ng-icons/material-icons/baseline';
import { IconButtonComponent } from '@ui/components';

@Component({
  selector: 'app-demo-icon-button',
  imports: [NgIcon, IconButtonComponent],
  templateUrl: './icon-button.component.html',
  styleUrl: './icon-button.component.css',
})
export class IconButtonDemoPageComponent {
  fabContainer = false;
  fabFixed = false;
  icon = {
    matAdd,
    matClear,
    matPhone,
    matSchedule,
    matSearch,
  };

  onToggleFabContainer() {
    this.fabContainer = !this.fabContainer;
  }

  onToggleFabFixed() {
    this.fabFixed = !this.fabFixed;
  }
}
