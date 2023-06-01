import { ChangeDetectionStrategy, Component, ElementRef, HostBinding, Input, OnChanges, OnDestroy, OnInit, SimpleChanges, ViewEncapsulation, inject } from '@angular/core';
import { filter, fromEvent, takeUntil } from 'rxjs';

import { EventSource, OnceSource } from '@app/common/sources';
import { KEYBOARD_KEY as KB } from '@app/common/types';
import { didInputChange } from '@app/common/utils';

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
  host: {
    class: 'app-cosmetic-checkbox',
    role: 'checkbox',
  },
})
export class CosmeticCheckboxComponent implements OnInit, OnChanges, OnDestroy {

  private once = new OnceSource();
  private host = inject(ElementRef);
  private disableKeydownListener$ = new EventSource<void>(this.once.event$);

  @Input()
  @HostBinding('class.-checked')
  @HostBinding('attr.aria-checked') checked = false;

  @Input()
  @HostBinding('style.--app-cosmetic-checkbox-size')
  size = '20px';

  @Input() color: CosmeticCheckboxColor = 'primary';
  @Input() isInteractable = true;

  @HostBinding('class') cssClasses = '-color-primary';
  @HostBinding('class.-interactable') cssIsInteractable = true;
  @HostBinding('tabindex') tabIndex = '0';

  ngOnInit() {
    if (this.isInteractable) {
      console.log('initialized isInteractable', this.isInteractable); // TODO: Remove
      this.cssIsInteractable = this.isInteractable;
      this.tabIndex = this.isInteractable ? '0' : '-1';
      this.toggleKeyboardListener();
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (didInputChange(changes['isInteractable'])) {
      console.log('initialized isInteractable', this.isInteractable); // TODO: Remove
      this.cssIsInteractable = this.isInteractable;
      this.tabIndex = this.isInteractable ? '0' : '-1';
      this.toggleKeyboardListener();
    }

    if (didInputChange(changes['color'])) {
      this.cssClasses = `-color-${this.color}`;
    }
  }

  ngOnDestroy() {
    this.once.trigger();
  }

  private toggleKeyboardListener(): void {

    console.log('toggling keyboard listener');

    // this.disableKeydownListener$.next();

    fromEvent<KeyboardEvent>(this.host.nativeElement, 'keydown').pipe(
      takeUntil(this.once.event$),
      // takeUntil(this.disableKeydownListener$.event$),
      filter(event => event.code === KB.SPACE),
    ).subscribe(event => {
      event.stopImmediatePropagation();
      event.preventDefault();
      this.checked = !this.checked;
      console.log('Space pressed'); // TODO: Remove
    });
  }
}
