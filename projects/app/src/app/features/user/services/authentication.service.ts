import { Injectable, inject } from '@angular/core';
import { Auth, Unsubscribe, UserCredential, onAuthStateChanged, signInWithEmailAndPassword, signOut } from '@angular/fire/auth';
import { Observable, from, map, tap } from 'rxjs';

import { UserCredentials, UserData } from '../types';
import { Store } from '@ngrx/store';
import { userSignInActions } from '../store';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {

  private auth = inject(Auth);
  private store = inject(Store);

  constructor() {
    this.initAutoLogin();
  }

  signIn({ email, password }: UserCredentials): Observable<UserData> {
    return from(signInWithEmailAndPassword(this.auth, email, password))

      // TODO: Remove
      .pipe(tap((user) => {
        user.user.getIdTokenResult().then(res => {
          console.log('claims', res.claims);
          console.log('isAdmin', res.claims['role'] === 'admin');
        });
      }))

      .pipe(map(({ user }: UserCredential) => user.toJSON() as UserData));
  }

  signOut(): Observable<any> {
    return from(signOut(this.auth));
  }

  private initAutoLogin(): void {

    let unsub!: Unsubscribe;

    unsub = onAuthStateChanged(this.auth, user => {
      if (user) {
        const userData = user.toJSON() as UserData;
        const payload = { user: userData };
        this.store.dispatch(userSignInActions.autoSignIn(payload));
      }
      unsub();
    });
  }
}
