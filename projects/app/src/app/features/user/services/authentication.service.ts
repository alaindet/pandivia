import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';

import { UserCredentials } from '../types';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {

  // TODO
  signIn({ email, password }: UserCredentials): Observable<any> {
    if (Math.random() > 0.7) return of(true);
    return throwError(() => Error('Nope!'));
  }

  // TODO
  signOut(): Observable<any> {
    if (Math.random() > 0.7) return of(true);
    return throwError(() => Error('Nope!'));
  }
}
