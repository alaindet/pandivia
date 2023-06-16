import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ContentChild, ElementRef, EventEmitter, HostBinding, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild, ViewEncapsulation, inject } from '@angular/core';
import { NgFor, NgIf, NgTemplateOutlet } from '@angular/common';

import { ActionsMenuItem, ActionsMenuViewModel } from './types';
import { ButtonComponent } from '../../button';
import { ActionsMenuService } from './services/actions-menu.service';
import { ActionsMenuItemDirective } from './directives/actions-menu-item.directive';
import { ActionsMenuButtonDirective } from './directives/actions-menu-button.directive';
import { filterNull } from '@app/common/rxjs';
import { MatIconModule } from '@angular/material/icon';
import { didInputChange, doOnce } from '@app/common/utils';

const imports = [
  NgIf,
  NgFor,
  NgTemplateOutlet,
  ButtonComponent,
  MatIconModule,
];

@Component({
  selector: 'app-actions-menu',
  standalone: true,
  imports,
  templateUrl: './actions-menu.component.html',
  styleUrls: ['./actions-menu.component.scss'],
  host: { class: 'app-actions-menu' },
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [ActionsMenuService],
})
export class ActionsMenuComponent implements OnInit, OnChanges {

  private svc = inject(ActionsMenuService);
  private cdr = inject(ChangeDetectorRef);
  private host = inject(ElementRef);
  vm: ActionsMenuViewModel | null = null;

  @Input() id!: string;
  @Input() actions: ActionsMenuItem[] = [];
  @Input() position: 'left' | 'right' = 'left';

  @Input()
  set offsetY(offsetY: number | string) {
    this.cssOffsetY = (typeof offsetY === 'number')
      ? `${offsetY}px`
      : offsetY;
  }

  @Output() actionConfirmed = new EventEmitter<string>();

  @HostBinding('style.--app-actions-menu-offset-y') cssOffsetY = '0';

  @ViewChild('itemsElementRef')
  set itemsElementRefChild(ref: ElementRef<HTMLElement>) {
    if (!ref) return;
    this.svc.init.itemsElement(ref.nativeElement);
  }

  @ContentChild(ActionsMenuItemDirective)
  set itemTemplateRef(dir: ActionsMenuItemDirective) {
    if (!dir) return;
    this.svc.templates.setItem(dir.template);
  }

  @ContentChild(ActionsMenuButtonDirective)
  set buttonTemplateRef(dir: ActionsMenuButtonDirective) {
    if (!dir) return;
    this.svc.templates.setButton(dir.template);
  }

  ngOnInit() {

    const initializeButton = doOnce(() => {
      setTimeout(() => {
        const buttonQuery = '.app-actions-menu-button button';
        const button = this.host.nativeElement.querySelector(buttonQuery);
        this.svc.init.buttonElement(button);
      }, 100);
    });

    this.svc.vm.pipe(filterNull()).subscribe(vm => {
      this.vm = vm;
      this.cdr.markForCheck();
      initializeButton();
    });

    this.svc.init.id(this.id);
    this.svc.init.actions(this.actions);
    this.svc.init.focus();
    this.svc.actions.confirmed$.subscribe(actionId => {
      this.actionConfirmed.emit(actionId);
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (didInputChange(changes['actions'])) {
      this.svc.actions.initOrUpdate(this.actions);
    }
  }

  onActionClicked(event: MouseEvent, actionId: string) {
    this.svc.actions.confirm(actionId);
    event.stopImmediatePropagation();
    event.preventDefault();
  }

  onActionMouseover(event: MouseEvent, actionId: string) {
    this.svc.focus.byId(actionId);
    event.stopImmediatePropagation();
    event.preventDefault();
  }
}
