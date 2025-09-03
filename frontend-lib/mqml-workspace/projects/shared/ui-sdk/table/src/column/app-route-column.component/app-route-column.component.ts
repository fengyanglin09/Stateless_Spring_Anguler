import { Component } from '@angular/core';
import {AppBaseFieldColumnComponent} from '../base/app-base-field-column-component';
import {AppTableColumnBodyRoute, AppTableColumnType} from '../../model/app-table-interface';
import {NgIf} from '@angular/common';
import {RouterLink} from '@angular/router';

@Component({
  selector: 'lib-app-route-column.component',
  imports: [
    NgIf,
    RouterLink
  ],
  templateUrl: './app-route-column.component.html',
  styleUrl: './app-route-column.component.scss'
})
export class AppRouteColumnComponent extends AppBaseFieldColumnComponent {

  url: string | undefined;
  queryParams: any;

  onValueInitialize(): void {
    if (this.column?.body && this.isColumnType(AppTableColumnType.ROUTE)) {
      const body = this.column.body as AppTableColumnBodyRoute
      if (body.url) {
        this.url = body.url;
      } else {
        this.url = typeof body.urlProvider === 'function' ? body.urlProvider(this.rowItem) : undefined;
      }
      this.queryParams = body.queryParamsProvider ? body.queryParamsProvider(this.rowItem, this.rowItem) : undefined;
    } else {
      this.url = undefined;
      this.queryParams = undefined;
    }
  }

}
