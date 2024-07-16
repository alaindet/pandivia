import { Injectable, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';

import { DEFAULT_ROUTE } from '@app/app.routes';
import { provideFeedback, updateStore } from '@app/common/store';
import { LOADING_STATUS, LoadingStatus } from '@app/common/types';
import { DEFAULT_LANGUAGE, Language } from '@app/core/language';
import { UiStoreFeatureService } from '@app/core/ui/store/__feature';
import { AuthenticationService } from '../services';
import { UserCredentials, UserData, UserDisplayData } from '../types';

@Injectable({
  providedIn: 'root',
})
export class UserStoreFeatureService {

  private router = inject(Router);
  private authService = inject(AuthenticationService);
  private ui = inject(UiStoreFeatureService);

  // State --------------------------------------------------------------------
  data = signal<UserData | null>(null);
  status = signal<LoadingStatus>(LOADING_STATUS.PRISTINE);
  language = signal<Language>(DEFAULT_LANGUAGE);

  // Feedback -----------------------------------------------------------------
  feedback = provideFeedback(this.ui, this.status);

  // Derived state ------------------------------------------------------------
  isLoaded = computed(() => (
    this.status() === LOADING_STATUS.IDLE ||
    this.status() === LOADING_STATUS.ERROR
  ));
  isGuest = computed(() => this.data() === null);
  isAuthenticated = computed(() => this.data() !== null);
  isAdmin = computed(() => !!this.data()?.isAdmin);
  email = computed(() => this.data()?.email ?? null);
  userId = computed(() => this.data()?.uid ?? null);
  display = computed(() => {
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
    } as UserDisplayData;
  });

  // Mutations ----------------------------------------------------------------
  signIn(credentials: UserCredentials) {
    updateStore(this.authService.signIn(credentials))
      .withFeedback(this.feedback)
      .withNotifications('auth.signInSuccess', 'auth.signInError')
      .onSuccess(user => {
        this.data.set(user);
        this.router.navigate([DEFAULT_ROUTE]);
      })
      .update();
  }

  signOut() {
    updateStore(this.authService.signOut())
      .withFeedback(this.feedback)
      .withNotifications('auth.signOutSuccess', 'auth.signOutError')
      .onSuccess(() => this.data.set(null))
      .update();
  }

  autoSignIn() {
    updateStore(this.authService.signOut())
      .withFeedback(this.feedback)
      .withNotifications(null, 'auth.signOutError')
      .onSuccess(userData => this.data.set(userData))
      .update();
  }
}
