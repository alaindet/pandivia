import { Injectable, inject } from '@angular/core';
import { Auth, Unsubscribe, User, onAuthStateChanged, signInWithEmailAndPassword, signOut } from '@angular/fire/auth';
import { Observable, from } from 'rxjs';

import { UserCredentials, UserData } from '../types';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {

  private auth = inject(Auth);

  signIn({ email, password }: UserCredentials): Observable<UserData> {
    return from(
      signInWithEmailAndPassword(this.auth, email, password)
        .then(r => this.getUserData(r.user))
    );
  }

  signOut(): Observable<any> {
    return from(signOut(this.auth));
  }

  autoSignIn(): Observable<UserData | null> {
    return from(new Promise<UserData | null>((resolve, reject) => {
      let unsub!: Unsubscribe;
      unsub = onAuthStateChanged(this.auth, async authState => {
        unsub();

        if (authState) {
          const user = await this.getUserData(authState);
          resolve(user);
          return;
        }

        reject(null);
      });
    }));
  }

  private async getUserData(user: User): Promise<UserData> {
    const userData = user.toJSON() as UserData;
    const token = await user.getIdTokenResult();
    const tokenTole = (token.claims['role'] ?? '').trim().toLowerCase();
    userData.isAdmin = tokenTole === 'admin';
    return userData;
  }

  authStateOnce(fn: (authState: User | null) => void): Promise<void> {
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
