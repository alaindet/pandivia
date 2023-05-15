import { Component, ViewEncapsulation, ChangeDetectionStrategy, Input } from '@angular/core';

// const IMPORTS = [
// ];

@Component({
  selector: 'app-page-header',
  standalone: true,
  // imports: IMPORTS,
  template: './page-header.component.html',
  styleUrls: ['./page-header.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'app-page-header' },
})
export class PageHeaderComponent {
  @Input() withBackButton = false;
}
