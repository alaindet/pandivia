import { ChangeDetectorRef, Component, HostBinding, ViewChild, ViewContainerRef, ViewEncapsulation, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

import { ButtonComponent } from '../../button';
import { ModalService } from '../modal.service';

const IMPORTS = [
  CommonModule,
  ButtonComponent,
  MatIconModule,
];

@Component({
  selector: 'app-modal-host',
  standalone: true,
  imports: IMPORTS,
  templateUrl: './modal-host.component.html',
  styleUrls: ['./modal-host.component.scss'],
  encapsulation: ViewEncapsulation.None,
  host: { class: 'app-modal-host' },
})
export class ModalHostComponent {

  private cdr = inject(ChangeDetectorRef);
  modalService = inject(ModalService);

  @HostBinding('class.-open') cssOpen = false;

  @ViewChild('modalTarget', { static: true, read: ViewContainerRef })
  modalTarget!: ViewContainerRef;

  ngOnInit() {
    this.modalService.registerTarget(this.modalTarget);
    this.modalService.open$.subscribe(open => {
      this.cssOpen = open;
      this.cdr.detectChanges();
    });
  }

  onDismiss() {
    this.modalService.cancel();
  }

  onConfirm() {
    this.modalService.clickConfirm();
  }
}
