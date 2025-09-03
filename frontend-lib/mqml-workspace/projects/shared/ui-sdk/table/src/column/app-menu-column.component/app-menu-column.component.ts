import { Component } from '@angular/core';
import {AppBaseColumnComponent} from '../base/app-base-column-component';
import {MenuItem} from 'primeng/api';
import {AppTableColumnBodyMenu, AppTableColumnType} from '../../model/app-table-interface';
import {Button} from 'primeng/button';
import {Menu} from 'primeng/menu';

@Component({
  selector: 'lib-app-menu-column',
  imports: [
    Button,
    Menu
  ],
  templateUrl: './app-menu-column.component.html',
  styleUrl: './app-menu-column.component.scss'
})
export class AppMenuColumnComponent extends AppBaseColumnComponent {
  menuItems: MenuItem[] = [];

  onInitialize(): void {
    if ((this.column?.body && this.isColumnType(AppTableColumnType.MENU))) {
      const body = (this.column.body as AppTableColumnBodyMenu);
      if (typeof body.menuItemProvider === 'function') {
        this.menuItems = body.menuItemProvider(this.rowItem, this.rowIndex) || [];
      }
    }
  }
}
