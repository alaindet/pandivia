import { NgTemplateOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  HostBinding,
  Injector,
  OnInit,
  ViewEncapsulation,
  computed,
  contentChild,
  effect,
  inject,
  input,
  output,
  runInInjectionContext,
  viewChild,
} from '@angular/core';
import { NgIcon } from '@ng-icons/core';
import { matMoreHoriz } from '@ng-icons/material-icons/baseline';
import { doOnce } from '@common/utils';

import { IconButtonComponent } from '../icon-button';
import { ActionsMenuButtonDirective } from './directives/actions-menu-button.directive';
import { ActionsMenuItemDirective } from './directives/actions-menu-item.directive';
import { ActionsMenuService } from './services/actions-menu.service';
import { ActionsMenuItem } from './types';

@Component({
  selector: 'app-actions-menu',
  imports: [NgTemplateOutlet, IconButtonComponent, NgIcon],
  templateUrl: './actions-menu.component.html',
  styleUrl: './actions-menu.component.css',
  host: { class: 'app-actions-menu' },
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [ActionsMenuService],
})
export class ActionsMenuComponent implements OnInit {
  private svc = inject(ActionsMenuService);
  private host = inject(ElementRef);
  private injector = inject(Injector);

  id = input.required<string>();
  actions = input.required<ActionsMenuItem[]>();
  position = input<'left' | 'right'>('left');
  offsetY = input('0');

  actionConfirmed = output<string>();

  actionsEffect = effect(() => {
    this.svc.actions.initOrUpdate(this.actions());
  });

  private cssOffsetY = computed(() => {
    const offsetY = this.offsetY();
    return typeof offsetY === 'number' ? `${offsetY}px` : offsetY;
  });

  icon = { matMoreHoriz };
  buttonTemplate = this.svc.templates.button;
  itemTemplate = this.svc.templates.item;
  isOpen = this.svc.menu.isOpen;
  itemsId = this.svc.ids.items;
  buttonId = this.svc.ids.button;
  focused = this.svc.focus.focused;
  menuActions = this.svc.actions.actions;

  @HostBinding('style.--_offset-y')
  get styleOffsetY() {
    return this.cssOffsetY();
  }

  itemsElementRef = viewChild<ElementRef<HTMLElement>>('itemsElementRef');
  itemsElementRefEffect = effect(() => {
    const ref = this.itemsElementRef();
    if (ref) doOnce(() => this.svc.itemsElement.init(ref.nativeElement))();
  });

  itemTemplateRef = contentChild(ActionsMenuItemDirective);
  itemTemplateRefEffect = effect(() => {
    const ref = this.itemTemplateRef();
    if (ref) doOnce(() => this.svc.templates.setItem(ref.template))();
  });

  buttonTemplateRef = contentChild(ActionsMenuButtonDirective);
  buttonTemplateRefEffect = effect(() => {
    const ref = this.buttonTemplateRef();
    if (ref) doOnce(() => this.svc.templates.setButton(ref.template))();
  });

  ngOnInit() {
    this.initButtonElement();
    this.svc.ids.init(this.id());
    this.svc.actions.confirmed.subscribe((actionId) => {
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

  // TODO: Refactor
  private initButtonElement(): void {
    doOnce(() => {
      setTimeout(() => {
        runInInjectionContext(this.injector, () => {
          const buttonQuery = '.app-actions-menu-button button';
          const button = this.host.nativeElement.querySelector(buttonQuery);
          this.svc.buttonElement.init(button);
        });
      }, 100);
    })();
  }
}
