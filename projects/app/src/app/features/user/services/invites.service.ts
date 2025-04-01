import { Injectable, inject } from '@angular/core';
import {
  Firestore,
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
} from '@angular/fire/firestore';
import { Observable, firstValueFrom, from } from 'rxjs';
import {
  Auth,
  createUserWithEmailAndPassword,
  updateProfile,
} from '@angular/fire/auth';

import {
  CreateUserInviteDto,
  SignUpUserDto,
  UserData,
  UserInvite,
} from '../types';
import { AuthenticationService } from './authentication.service';

const DAY_DURATION = 1000 * 60 * 60 * 24;

@Injectable({
  providedIn: 'root',
})
export class InvitesService {
  private auth = inject(Auth);
  private firestore = inject(Firestore);
  private authService = inject(AuthenticationService);

  createInvite(email: string): Observable<string> {
    return from(
      (async () => {
        const createdAt = Date.now();
        const expiresAt = createdAt + DAY_DURATION;
        const inviteDto: CreateUserInviteDto = { email, createdAt, expiresAt };
        const invitesRef = collection(this.firestore, 'invites');
        const inviteDoc = await addDoc(invitesRef, inviteDto);
        const { protocol, host } = window.location;
        return `${protocol}//${host}/signup?invite=${inviteDoc.id}`;
      })()
    );
  }

  findInvite(inviteId: UserInvite['id']): Observable<UserInvite | null> {
    return from(
      (async () => {
        const inviteRef = doc(this.firestore, 'invites', inviteId);
        const inviteDoc = await getDoc(inviteRef);
        if (!inviteDoc.exists()) return null;
        return { id: inviteDoc.id, ...inviteDoc.data() } as UserInvite;
      })()
    );
  }

  signUpUser(inviteId: string, dto: SignUpUserDto): Observable<UserData> {
    return from(
      (async () => {
        const { email, password, displayName } = dto;
        const { user } = await createUserWithEmailAndPassword(
          this.auth,
          email,
          password
        );
        await deleteDoc(doc(this.firestore, 'invites', inviteId));
        await updateProfile(user, { displayName });
        await firstValueFrom(this.authService.autoSignIn());
        return { ...user.toJSON(), displayName } as UserData;
      })()
    );
  }
}
