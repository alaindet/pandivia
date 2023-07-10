import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, from } from 'rxjs';
import { Store } from '@ngrx/store';
import { Auth, Unsubscribe, User, onAuthStateChanged, signInWithEmailAndPassword, signOut } from '@angular/fire/auth';

import { userSignInActions } from '../store';
import { UserCredentials, UserData } from '../types';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {

  private auth = inject(Auth);
  private store = inject(Store);

  constructor() {
    this.tryAutoSignIn();
  }

  signIn({ email, password }: UserCredentials): Observable<UserData> {
    return from(
      signInWithEmailAndPassword(this.auth, email, password)
        .then(r => this.getUserData(r.user))
    );
  }

  signOut(): Observable<any> {
    return from(signOut(this.auth));
  }

  tryAutoSignIn(): Promise<void> {
    return this.authStateOnce(async (authState: User | null) => {
      if (!authState) {
        this.store.dispatch(userSignInActions.autoSignInFailed());
        return;
      }
      const user = await this.getUserData(authState);
      this.store.dispatch(userSignInActions.autoSignIn({ user }));
    });
  }

  private async getUserData(user: User): Promise<UserData> {
    const userData = user.toJSON() as UserData;
    const token = await user.getIdTokenResult();
    userData.isAdmin = token.claims['role'] === 'admin';
    return userData;
  }

  private authStateOnce(fn: (authState: User | null) => void): Promise<void> {
    return new Promise(done => {
      let unsub!: Unsubscribe;
      unsub = onAuthStateChanged(this.auth, authState => {
        fn(authState);
        unsub();
        done();
      });
    });
  }
}
