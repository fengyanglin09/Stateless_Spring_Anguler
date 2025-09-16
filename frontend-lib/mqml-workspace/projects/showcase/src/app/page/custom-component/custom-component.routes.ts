import { Routes } from "@angular/router";
import {CustomComponent} from './custom-component';
import {CustomButton} from './custom-button/custom-button';


export const routes: Routes = [
  {
    path: '',
    component: CustomComponent,
    data: { breadcrumb: 'Components'},
    children: [
      {path: 'button', component: CustomButton, pathMatch: 'prefix', data: {breadcrumb: 'Button'}},
    ]
  }
]
