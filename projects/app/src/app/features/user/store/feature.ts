import { Injectable, computed, inject, signal } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { provideFeedback, updateStore } from '@app/common/store';
import { LOADING_STATUS, LoadingStatus } from '@common/types';
import { filter, map, take } from 'rxjs';

import { DEFAULT_ROUTE } from '@app/app.routes';
import { UiStore } from '@app/core/ui/store';
import { AuthenticationService } from '../services';
import { UserCredentials, UserData, UserDisplayData } from '../types';
import { createUserLanguageController } from './language';

@Injectable({
  providedIn: 'root',
})
export class UserStore {
  private router = inject(Router);
  private authService = inject(AuthenticationService);
  private ui = inject(UiStore);

  // Substores ----------------------------------------------------------------
  language = createUserLanguageController();

  // State --------------------------------------------------------------------
  data = signal<UserData | null>(null);
  status = signal<LoadingStatus>(LOADING_STATUS.PRISTINE);

  // Feedback -----------------------------------------------------------------
  feedback = provideFeedback(this.ui, this.status);

  // Derived state ------------------------------------------------------------
  isLoaded = computed(
    () =>
      this.status() === LOADING_STATUS.IDLE ||
      this.status() === LOADING_STATUS.ERROR
  );
  isGuest = computed(() => this.data() === null);
  isAuthenticated = computed(() => this.data() !== null);
  isAdmin = computed(() => !!this.data()?.isAdmin);
  email = computed(() => this.data()?.email ?? null);
  userId = computed(() => this.data()?.uid ?? null);
  display = computed(() => this.computeDisplayData());
  isAppStableAndAuthenticated = toObservable(this.isLoaded).pipe(
    filter((val) => !!val),
    take(1),
    map(() => this.isAuthenticated())
  );

  constructor() {
    this.language.init();
  }

  // Mutations ----------------------------------------------------------------
  signIn(credentials: UserCredentials) {
    updateStore(this.authService.signIn(credentials))
      .withFeedback(this.feedback)
      .withNotifications('auth.signInSuccess', 'auth.signInError')
      .onSuccess((user) => {
        this.data.set(user);
        this.router.navigate([DEFAULT_ROUTE]);
      })
      .update();
  }

  signOut() {
    updateStore(this.authService.signOut())
      .withFeedback(this.feedback)
      .withNotifications('auth.signOutSuccess', 'auth.signOutError')
      .onSuccess(() => {
        this.data.set(null);
        this.router.navigate(['/signin']);
      })
      .update();
  }

  autoSignIn() {
    updateStore(this.authService.autoSignIn())
      .withFeedback(this.feedback)
      .onSuccess((userData) => {
        this.data.set(userData);
      })
      .update();
  }

  private computeDisplayData(): UserDisplayData | null {
    const user = this.data();
    if (!user) {
      return null;
    }

    return {
      email: user.email,
      displayName: user.displayName,
      isAdmin: user.isAdmin,
      createdAt: user.createdAt,
      lastLoginAt: user.lastLoginAt,
    };
  }
}
