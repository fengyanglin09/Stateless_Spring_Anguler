import { Routes } from "@angular/router";
import {CustomComponent} from './custom-component';
import {CustomButton} from './custom-button/custom-button';
import {CustomCard} from './custom-card/custom-card';


export const routes: Routes = [
  {
    path: '',
    component: CustomComponent,
    data: { breadcrumb: 'Components'},
    children: [
      {path: 'button', component: CustomButton, pathMatch: 'prefix', data: {breadcrumb: 'Button'}},
      {path: 'card', component: CustomCard, pathMatch: 'prefix', data: {breadcrumb: 'Card'}},
    ]
  }
]
