import { Routes } from '@angular/router';
import {AppLayout} from 'mqml-angular-ui-layout-sdk/layout-template/ui-template';
import {AppAuthGuard} from 'mqml-angular-ui-layout-sdk/layout-interface';

export const routes: Routes = [
  {
    path: '', component: AppLayout, canActivate: [AppAuthGuard.canActivate],
  }
];
