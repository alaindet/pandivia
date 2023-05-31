import { Component, ViewEncapsulation, ChangeDetectionStrategy, Input, HostBinding, OnInit } from '@angular/core';

type CosmeticCheckboxColor = 'primary' | 'secondary' | 'tertiary' | 'black';

@Component({
  selector: 'app-cosmetic-checkbox',
  standalone: true,
  template: `
    <span class="_checkmark"></span>
    <span class="_content"><ng-content></ng-content></span>
  `,
  styleUrls: ['./cosmetic-checkbox.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'app-cosmetic-checkbox' },
})
export class CosmeticCheckboxComponent implements OnInit {
  
  @Input() @HostBinding('class.-checked') checked = false;
  @Input() color: CosmeticCheckboxColor = 'primary';
  @Input() @HostBinding('style.--app-cosmetic-checkbox-size') size = '20px';

  @HostBinding('class') cssClasses!: string;

  ngOnInit() {
    this.cssClasses = `-color-${this.color}`;
  }
}
