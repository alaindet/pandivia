import { Location } from '@angular/common';
import { inject } from '@angular/core';

export type BackButtonControllerConfig = {
  onConfirm: () => void;
};

export function createBackButtonController(
  config?: BackButtonControllerConfig,
) {

}

function defaultBackButtonAction() {
  inject(Location).back();
}
