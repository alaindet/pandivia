import { NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ContentChild, ElementRef, HostBinding, OnChanges, OnInit, SimpleChanges, ViewChild, ViewEncapsulation, computed, effect, inject, input, output, viewChild } from '@angular/core';

import { MatIconModule } from '@angular/material/icon';
import { filterNull } from '@app/common/rxjs';
import { didInputChange, doOnce } from '@app/common/utils';
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
export class ActionsMenuComponent implements OnInit, OnChanges {

  private svc = inject(ActionsMenuService);
  private cdr = inject(ChangeDetectorRef);
  private host = inject(ElementRef);
  vm: ActionsMenuViewModel | null = null;

  id = input.required<string>();
  actions = input.required<ActionsMenuItem[]>();
  position = input<'left' | 'right'>('left');
  offsetY = input('0');

  actionConfirmed = output<string>();

  private cssOffsetY = computed(() => {
    const offsetY = this.offsetY();
    return (typeof offsetY === 'number') ? `${offsetY}px` : offsetY;
  });

  @HostBinding('style.--app-actions-menu-offset-y')
  get styleOffsetY() {
    return this.cssOffsetY();
  }

  itemsElementRef = viewChild<ElementRef<HTMLElement>>('itemsElementRef');
  itemsElement$ = effect(() => {
    const el = this.itemsElementRef();
    if (!el) return;
    this.svc.init.itemsElement(el.nativeElement);
  });

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

    this.svc.init.id(this.id());
    this.svc.init.actions(this.actions());
    this.svc.init.focus();
    this.svc.actions.confirmed$.subscribe(actionId => {
      this.actionConfirmed.emit(actionId);
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (didInputChange(changes['actions'])) {
      this.svc.actions.initOrUpdate(this.actions());
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
