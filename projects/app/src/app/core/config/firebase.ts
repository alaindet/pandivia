import { importProvidersFrom } from '@angular/core';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { getFirestore, provideFirestore, connectFirestoreEmulator } from '@angular/fire/firestore';
import { connectAuthEmulator, getAuth, provideAuth } from '@angular/fire/auth';

import { environment } from '@app/environment';

export const FIREBASE_PROVIDERS = [
  importProvidersFrom([
    provideFirebaseApp(() => initializeApp(environment.firebase.config)),
      provideFirestore(() => {
        const firestore = getFirestore();
        if (environment.firebase.useEmulators) {
          connectFirestoreEmulator(firestore, 'localhost', 8080);
        }
        return firestore;
      }),
      provideAuth(() => {
        const auth = getAuth();
        if (environment.firebase.useEmulators) {
          connectAuthEmulator(auth, 'http://localhost:9099');
        }
        return auth;
      }),
  ]),
];
