import { Component } from '@angular/core';
import { NgIcon } from '@ng-icons/core';
import { matTaskAlt as taskAlt } from '@ng-icons/material-icons/baseline';

@Component({
  selector: 'app-demo-index',
  imports: [NgIcon],
  template: `
    <p>Please select a demo page from the menu</p>
    <!-- <ng-icon name="taskAlt" /> -->
    <ng-icon [svg]="taskAlt" color="blue" size="150px" />
  `,
  // viewProviders: [provideIcons({ taskAlt })],
})
export class IndexDemoPageComponent {
  taskAlt = taskAlt;
}
