import { Component } from '@angular/core';
import { NgIcon } from '@ng-icons/core';
import {
  matAdd,
  matClear,
  matSchedule,
  matSearch,
} from '@ng-icons/material-icons/baseline';

import { ButtonComponent } from '@app/common/components';

@Component({
  selector: 'app-demo-button',
  imports: [ButtonComponent, NgIcon],
  templateUrl: './button.component.html',
  styleUrl: './button.component.scss',
})
export class ButtonDemoPageComponent {
  fabContainer = false;
  fabFixed = false;
  matSchedule = matSchedule;
  matSearch = matSearch;
  matAdd = matAdd;
  matClear = matClear;

  onToggleFabContainer() {
    this.fabContainer = !this.fabContainer;
  }

  onToggleFabFixed() {
    this.fabFixed = !this.fabFixed;
  }
}
