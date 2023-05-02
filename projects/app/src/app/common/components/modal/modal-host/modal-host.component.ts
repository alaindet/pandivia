import { CommonModule } from '@angular/common';
import { Component, ViewEncapsulation } from '@angular/core';

const IMPORTS = [
  CommonModule,
];

@Component({
  selector: 'app-modal-host',
  standalone: true,
  imports: IMPORTS,
  template: `
    <div class="app-modal">
      <ng-container #modalTarget></ng-container>
    </div>
  `,
  styleUrls: ['./modal-host.component.scss'],
  encapsulation: ViewEncapsulation.None,
  host: { class: 'app-modal-container' },
})
export class ModalHostComponent {
  // ...
  // https://dev.to/railsstudent/render-ngtemplates-dynamically-using-viewcontainerref-in-angular-17lp
}
