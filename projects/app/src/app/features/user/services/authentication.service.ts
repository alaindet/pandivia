import { Injectable, inject } from '@angular/core';
import { Auth, User, UserCredential, onAuthStateChanged, signInWithEmailAndPassword, signOut } from '@angular/fire/auth';
import { Observable, from, map } from 'rxjs';

import { UserCredentials } from '../types';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {

  private auth = inject(Auth);

  constructor() {
    this.initAuthStateListener();
  }

  signIn({ email, password }: UserCredentials): Observable<User> {
    return from(signInWithEmailAndPassword(this.auth, email, password))
      .pipe(map(({ user }: UserCredential) => user));
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
