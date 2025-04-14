import { Injectable, inject } from '@angular/core';
import { SwUpdate } from '@angular/service-worker';
import { filter, take } from 'rxjs';
import { TranslocoService } from '@jsverse/transloco';
import { ModalService } from '@ui/components';

import { UPGRADE_APPLICATION_PROMPT } from './prompt';
import { ConfirmPromptModalComponent } from '@ui/components';

@Injectable({
  providedIn: 'root',
})
export class SoftwareUpdateService {
  private transloco = inject(TranslocoService);
  private modal = inject(ModalService);
  private swUpdates = inject(SwUpdate);

  check(): void {
    if (!this.swUpdates.isEnabled) {
      return;
    }

    const newVersionExists$ = this.swUpdates.versionUpdates.pipe(
      filter((e) => e.type === 'VERSION_READY')
    );

    newVersionExists$.subscribe(() => {
      const prompt = {
        ...UPGRADE_APPLICATION_PROMPT,
        title: this.transloco.translate(UPGRADE_APPLICATION_PROMPT.title),
        message: this.transloco.translate(UPGRADE_APPLICATION_PROMPT.message),
      };

      const modal$ = this.modal.open(ConfirmPromptModalComponent, prompt);
      modal$
        .closed()
        .pipe(take(1))
        .subscribe({
          error: () => console.log('Canceled'),
          next: () => document.location.reload(),
        });
    });
  }
}
