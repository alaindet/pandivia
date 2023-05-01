import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

const IMPORTS = [
  CommonModule,
];

@Component({
  selector: 'app-demo-modal',
  standalone: true,
  imports: IMPORTS,
  templateUrl: './modal.component.html',
})
export class ModalDemoPageComponent {
  // ...
}
