import { Injectable, inject } from '@angular/core';
import { Auth, UserCredential, onAuthStateChanged, signInWithEmailAndPassword, signOut } from '@angular/fire/auth';
import { Observable, from, map } from 'rxjs';

import { UserCredentials, UserData } from '../types';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {

  private auth = inject(Auth);

  constructor() {
    this.initAuthStateListener();
  }

  signIn({ email, password }: UserCredentials): Observable<UserData> {
    return from(signInWithEmailAndPassword(this.auth, email, password))
      .pipe(map(({ user }: UserCredential) => user.toJSON() as UserData));
  }

  signOut(): Observable<any> {
    return from(signOut(this.auth));
  }

  private initAuthStateListener(): void {
    onAuthStateChanged(this.auth, user => {
      console.log('onAuthStateChanged', user); // TODO: Remove
    });
  }
}
