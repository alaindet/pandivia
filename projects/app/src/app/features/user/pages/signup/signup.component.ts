import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { PageHeaderComponent } from '@app/common/components';

const imports = [
  PageHeaderComponent,
];

@Component({
  selector: 'app-signup-page',
  standalone: true,
  imports,
  templateUrl: './signup.component.html',
})
export default class SignUpPageComponent implements OnInit {

  private route = inject(ActivatedRoute);

  ngOnInit() {
    const inviteId = this.route.snapshot.params['invite'];

    console.log('SignUpPageComponent.inviteId', inviteId);

    if (!inviteId) {
      // TODO: Error!
    }

    // TODO: Find invite on Firestore
    // TODO: Check expiration
    // TODO: Check matching email on sign up
    // TODO: Remove invite on sign up
    // TODO: Extract sign in form as component and reuse it here!
  }
}
