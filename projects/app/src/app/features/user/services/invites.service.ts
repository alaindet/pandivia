import { Injectable, inject } from '@angular/core';
import { Firestore, addDoc, collection, doc, getDoc } from '@angular/fire/firestore';
import { Observable, from } from 'rxjs';

import { DAY_DURATION } from '@app/common/constants';
import { CreateUserInviteDto, UserInvite } from '../types';

@Injectable({
  providedIn: 'root',
})
export class InvitesService {

  private firestore = inject(Firestore);

  createInvite(email: string): Observable<UserInvite['id']> {
    return from((async () => {
      const createdAt = Date.now();
      const expiresAt = createdAt + DAY_DURATION;
      const inviteDto: CreateUserInviteDto = { email, createdAt, expiresAt };
      const invitesRef = collection(this.firestore, 'invites');
      const inviteDoc = await addDoc(invitesRef, inviteDto);
      return inviteDoc.id;
    })());
  }

  findInvite(inviteId: UserInvite['id']): Observable<UserInvite | null> {
    return from((async () => {
      const inviteRef = doc(this.firestore, 'invites', inviteId);
      const inviteDoc = await getDoc(inviteRef);
      if (!inviteDoc.exists()) return null;
      return { id: inviteDoc.id, ...inviteDoc.data() } as UserInvite;
    })());
  }
}
