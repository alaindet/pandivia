import { Component, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import { BaseModalComponent, ModalHeaderDirective } from '@ui/components';
import { ModalOneInput, ModalOneOutput } from './types';

@Component({
  selector: 'app-demo-modal-one',
  imports: [ReactiveFormsModule, ModalHeaderDirective],
  templateUrl: './modal-one.component.html',
})
export class ModalOneComponent
  extends BaseModalComponent<ModalOneInput, ModalOneOutput>
  implements OnInit
{
  myForm!: FormGroup;

  ngOnInit() {
    this.registerOnConfirm(this.onConfirm.bind(this));
    this.myForm = new FormGroup({
      text: new FormControl(this.modal.data.value, [Validators.required]),
    });
  }

  onCancel() {
    this.modal.cancel();
  }

  onConfirm() {
    const data: ModalOneOutput = this.myForm.value;
    this.modal.confirm(data);
  }
}
