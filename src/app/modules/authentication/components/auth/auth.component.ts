import { Component } from '@angular/core';
import { ChildrenOutletContexts } from '@angular/router';

import { slideInAnimation } from 'src/app/modules/shared/models/animation-slide';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss'],
  animations: [slideInAnimation]
})
export class AuthComponent {

  constructor(private contexts: ChildrenOutletContexts) {}

  getRouteAnimationData() {
    return this.contexts.getContext('primary')?.route?.snapshot?.data?.['animation'];
  }

}
