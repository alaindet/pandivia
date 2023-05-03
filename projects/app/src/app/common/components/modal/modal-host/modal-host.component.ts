import { ChangeDetectorRef, Component, HostBinding, ViewChild, ViewContainerRef, ViewEncapsulation, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

import { ModalService } from '../modal.service';
import { ButtonComponent } from '../../button';

const IMPORTS = [
  CommonModule,
  ButtonComponent,
  MatIconModule,
];

@Component({
  selector: 'app-modal-host',
  standalone: true,
  imports: IMPORTS,
  template: `
    <div class="_modal">
      <ng-container #modalTarget></ng-container>
      <button
        type="button"
        class="_dismiss"
        appButton="secondary"
        (click)="onDismiss()"
      >
        <mat-icon>clear</mat-icon>
      </button>
    </div>
    <div class="_backdrop"></div>
  `,
  styleUrls: ['./modal-host.component.scss'],
  encapsulation: ViewEncapsulation.None,
  host: { class: 'app-modal-host' },
})
export class ModalHostComponent {

  modalService = inject(ModalService);
  cdr = inject(ChangeDetectorRef);

  @HostBinding('class.-open') cssOpen = false;

  @ViewChild('modalTarget', { static: true, read: ViewContainerRef })
  modalTarget!: ViewContainerRef;

  ngOnInit() {
    this.modalService.registerTarget(this.modalTarget);
    this.modalService.open$.subscribe(open => {

      // TODO: Remove
      console.log('modal changed open state', open);

      this.cssOpen = open;
      this.cdr.detectChanges();
    });
  }

  onDismiss() {
    this.modalService.close();
  }
}
