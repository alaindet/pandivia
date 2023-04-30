import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-demo-header',
  standalone: true,
  template: `
    <h1><ng-content></ng-content></h1>
    <div>Pandivia Demo v{{ version }}</div>
  `,
  styles: [`
    :host {
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
    }

    h1 {
      margin: 0;
    }
  `],
})
export class DemoHeaderComponent {
  @Input() version!: string;
}
