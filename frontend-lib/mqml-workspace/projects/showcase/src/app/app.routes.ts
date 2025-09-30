import { Routes } from '@angular/router';
import {AppLayout} from 'mqml-angular-ui-layout-sdk/layout-template/ui-template';
import {
  AppAccessDenied,
  AppAuthGuard,
  AppError,
  AppLanding,
  AppNotFound
} from 'mqml-angular-ui-layout-sdk/layout-interface';
import {Home} from './page/home/home';


export const routes: Routes = [
  {
    path: '', component: AppLayout, canActivate: [AppAuthGuard.canActivate],
    children: [

      {path: '', redirectTo: '/dashboard', pathMatch: 'full'},
      {path: 'dashboard', component: Home, pathMatch: 'prefix', data: {breadcrumb: 'Dashboard'}},

      {
        path: 'components', loadChildren: () => import('./page/custom-component/custom-component.routes')
          .then(m => m.routes)
      },

      {path: 'error', component: AppError},
      {path: 'not-found', component: AppNotFound},
      {path: 'access-denied', component: AppAccessDenied},
    ]
  },
  {path: 'landing', component: AppLanding},
  {path: 'landing-custom', component: AppLanding, data: {backgroundUrl: '/assets/images/landing-background.jpg'}},
  {path: '**', redirectTo: "not-found"}
];
