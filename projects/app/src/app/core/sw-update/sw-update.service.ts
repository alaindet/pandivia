import { Injectable } from '@angular/core';
import { SwUpdate } from '@angular/service-worker';
import { filter } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SoftwareUpdateService {

  constructor(swUpdates: SwUpdate) {

    if (!swUpdates.isEnabled) {
      return;
    }

    // const appIsStable$ = appRef.isStable.pipe(first(isStable => isStable === true));
    const newVersionExists$ = swUpdates.versionUpdates.pipe(filter(e => e.type === 'VERSION_READY'));

    // concat(appIsStable$, newVersionExists$).subscribe(() => {
    newVersionExists$.subscribe(() => {

      // TODO: Remove
      console.log('A new version exists');

      // TODO: Ask the user via prompt if the application should reload
      const userConfirmed = false;

      if (userConfirmed) {
        document.location.reload();
      }
    });
  }
}
