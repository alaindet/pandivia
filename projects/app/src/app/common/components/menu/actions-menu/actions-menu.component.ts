import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ContentChild, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild, ViewEncapsulation, inject } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ActionsMenuItem, ActionsMenuViewModel } from './types';
import { ButtonComponent } from '../../button';
import { ActionsMenuService } from './services/actions-menu.service';
import { ActionsMenuItemDirective } from './directives/actions-menu-item.directive';
import { ActionsMenuButtonDirective } from './directives/actions-menu-button.directive';
import { filterNull } from '@app/common/rxjs';

const IMPORTS = [
  CommonModule,
];

@Component({
  selector: 'app-actions-menu',
  standalone: true,
  imports: IMPORTS,
  templateUrl: './actions-menu.component.html',
  styleUrls: ['./actions-menu.component.scss'],
  host: { class: 'app-actions-menu' },
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [ActionsMenuService],
})
export class ActionsMenuComponent implements OnInit {

  private svc = inject(ActionsMenuService);
  private cdr = inject(ChangeDetectorRef);
  vm: ActionsMenuViewModel | null = null;

  @Input() id!: string;
  @Input() actions: ActionsMenuItem[] = [];
  @Input() position: 'left' | 'right' = 'left';

  @Output() actionConfirmed = new EventEmitter<string>();

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

  @ContentChild(ButtonComponent)
  set buttonChild(menuButton: ButtonComponent) {
    if (!menuButton) return;
    this.svc.init.buttonElement(menuButton.getNativeElement());
  }

  ngOnInit() {
    // TODO: This is quite bad
    this.svc.vm.pipe(filterNull()).subscribe(vm => {
      this.vm = vm;
      this.cdr.markForCheck();
    });
    this.svc.init.id(this.id);
    this.svc.init.actions(this.actions);
    this.svc.actions.confirmed$.subscribe(actionId => this.actionConfirmed.emit(actionId));
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
