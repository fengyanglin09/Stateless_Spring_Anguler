import {Routes} from '@angular/router';
import {OauthGuard} from './core/security/oauth.guard';
import {AppError, AppLayout, AppLogin, AppNotFound} from './features/layout';


export const routes: Routes = [
  { path: '', component: AppLayout, canActivate: [OauthGuard], canActivateChild: [OauthGuard]

  },
  {path: 'error', component: AppError},
  {path: 'login', component: AppLogin},
  {path: '**', component: AppNotFound}
];
