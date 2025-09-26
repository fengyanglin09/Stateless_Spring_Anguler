import { Routes } from "@angular/router";
import {CustomComponent} from './custom-component';
import {CustomButton} from './custom-button/custom-button';
import {CustomCard} from './custom-card/custom-card';
import {CustomLabelField} from './custom-label-field/custom-label-field';
import {CustomTable} from './custom-table/custom-table';


export const routes: Routes = [
  {
    path: '',
    component: CustomComponent,
    data: { breadcrumb: 'Components'},
    children: [
      {path: 'button', component: CustomButton, pathMatch: 'prefix', data: {breadcrumb: 'Button'}},
      {path: 'card', component: CustomCard, pathMatch: 'prefix', data: {breadcrumb: 'Card'}},
      {path: 'label-field', component: CustomLabelField, pathMatch: 'prefix', data: {breadcrumb: 'Label Field'}},
      // {path: 'comment-dialog', component: CommentDialogComponent, pathMatch: 'prefix', data: {breadcrumb: 'Comment Dialog'}},
      // {path: 'comment-list', component: CadCommentList, pathMatch: 'prefix', data: {breadcrumb: 'Comment List'}},
      // {path: 'content-overflow-ellipsis', component: ContentOverflowEllipsisComponent, pathMatch: 'prefix', data: {breadcrumb: 'Content Overflow Ellipsis'}},
      // {path: 'dialog', component: DialogComponent, pathMatch: 'prefix', data: {breadcrumb: 'Dialog'}},
      // {path: 'editor', component: EditorComponent, pathMatch: 'prefix', data: {breadcrumb: 'Editor'}},
      {path: 'table', component: CustomTable, pathMatch: 'full', data: {breadcrumb: 'Table'}}
    ]
  }
]
