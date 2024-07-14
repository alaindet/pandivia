import { Injectable, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';

import { LOADING_STATUS, LoadingStatus } from '@app/common/types';
import { DEFAULT_LANGUAGE, Language } from '@app/core/language';
import { UiStoreFeatureService } from '@app/core/ui/store/__feature';
import { UserCredentials, UserData, UserDisplayData } from '../types';
import { AuthenticationService } from '../services';
import { finalize } from 'rxjs';

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

  // Derived state ------------------------------------------------------------
  isLoaded = computed(() => (
    this.status() === LOADING_STATUS.IDLE ||
    this.status() === LOADING_STATUS.ERROR
  ));
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
    this.status.set(LOADING_STATUS.LOADING);
    this.ui.loading.start();
    
    this.authService.signIn(credentials)
      .pipe(finalize(() => {
        this.ui.loading.stop();
      }))
      .subscribe({
        error: err => {
          console.error(err);
          this.status.set(LOADING_STATUS.ERROR);
          this.ui.notifications.success('auth.signInError');
        },
        next: user => {
          this.status.set(LOADING_STATUS.IDLE);
          this.ui.notifications.success('auth.signInSuccess');
          this.data.set(user);
        },
      });
  }

  signOut() {
    this.status.set(LOADING_STATUS.LOADING);
  }
}
