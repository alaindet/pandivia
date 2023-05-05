import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

export type ModalOneInput = {
  value: string | null;
};

export type ModalOneOutput = {
  value: string;
};

const IMPORTS = [
  CommonModule,
];

@Component({
  selector: 'app-demo-modal-one',
  standalone: true,
  imports: IMPORTS,
  template: `
    <app-modal-header>
      <h2>The modal header</h2>
    </app-modal-header>

    <app-modal-body>
      <p>The modal body</p>
      <label>
        Just an input
        <input type="text" placeholder="Enter value...">
      </label>
    </app-modal-body>

    <app-modal-footer>
      <button type="button" appButton="ghost" (click)="onCancel()">
        Cancel
      </button>
      <button type="button" appButton="primary" (click)="onConfirm()">
        Confirm
      </button>
    </app-modal-footer>
  `,
  styles: [`
    @import 'scoped';

    :host {
      border: 1px solid red;
    }
  `],
})
export class ModalOneComponent {
  onCancel() {

  }

  onConfirm() {

  }
}
