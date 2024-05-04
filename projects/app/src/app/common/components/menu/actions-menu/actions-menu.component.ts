import { NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, HostBinding, OnInit, ViewEncapsulation, computed, contentChild, effect, inject, input, output, viewChild } from '@angular/core';

import { MatIconModule } from '@angular/material/icon';
import { filterNull } from '@app/common/rxjs';
import { doOnce } from '@app/common/utils';
import { ButtonComponent } from '../../button';
import { ActionsMenuButtonDirective } from './directives/actions-menu-button.directive';
import { ActionsMenuItemDirective } from './directives/actions-menu-item.directive';
import { ActionsMenuService } from './services/actions-menu.service';
import { ActionsMenuItem, ActionsMenuViewModel } from './types';

const imports = [
  NgTemplateOutlet,
  ButtonComponent,
  MatIconModule,
];

@Component({
  selector: 'app-actions-menu',
  standalone: true,
  imports,
  templateUrl: './actions-menu.component.html',
  styleUrl: './actions-menu.component.scss',
  host: { class: 'app-actions-menu' },
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [ActionsMenuService],
})
export class ActionsMenuComponent implements OnInit {

  private svc = inject(ActionsMenuService);
  private cdr = inject(ChangeDetectorRef);
  private host = inject(ElementRef);
  vm: ActionsMenuViewModel | null = null;

  id = input.required<string>();

  actions = input.required<ActionsMenuItem[]>();
  actionsEffect = effect(() => {
    this.svc.actions.initOrUpdate(this.actions());
  });

  position = input<'left' | 'right'>('left');
  offsetY = input('0');

  actionConfirmed = output<string>();

  private cssOffsetY = computed(() => {
    const offsetY = this.offsetY();
    return (typeof offsetY === 'number') ? `${offsetY}px` : offsetY;
  });

  @HostBinding('style.--_offset-y')
  get styleOffsetY() {
    return this.cssOffsetY();
  }

  constructor() {
    effect(() => {
      this.svc.actions.initOrUpdate(this.actions());
    });
  }

  itemsElementRef = viewChild<ElementRef<HTMLElement>>('itemsElementRef');
  itemsElementRefEffect = effect(() => {
    const ref = this.itemsElementRef();
    if (ref) doOnce(() => this.svc.init.itemsElement(ref.nativeElement));
  });

  itemTemplateRef = contentChild(ActionsMenuItemDirective);
  itemTemplateRefEffect = effect(() => {
    const ref = this.itemTemplateRef();
    if (ref) doOnce(() => this.svc.templates.setItem(ref.template));
  });

  buttonTemplateRef = contentChild(ActionsMenuButtonDirective);
  buttonTemplateRefEffect = effect(() => {
    const ref = this.buttonTemplateRef();
    if (ref) doOnce(() => this.svc.templates.setButton(ref.template));
  });

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

    this.svc.init.id(this.id());
    this.svc.init.actions(this.actions());
    this.svc.init.focus();
    this.svc.actions.confirmed$.subscribe(actionId => {
      this.actionConfirmed.emit(actionId);
    });
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
