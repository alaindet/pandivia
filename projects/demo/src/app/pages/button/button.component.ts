import { Component } from '@angular/core';
import { NgIcon } from '@ng-icons/core';
import { matSearch } from '@ng-icons/material-icons/baseline';
import { ButtonComponent } from '@ui/components';

@Component({
  selector: 'app-demo-button',
  imports: [NgIcon, ButtonComponent],
  templateUrl: './button.component.html',
  styleUrl: './button.component.css',
})
export class ButtonDemoPageComponent {
  icon = { matSearch };
}
