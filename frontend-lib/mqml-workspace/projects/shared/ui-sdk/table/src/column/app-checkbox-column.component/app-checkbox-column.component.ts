import {Component, OnChanges} from '@angular/core';
import {Checkbox} from 'primeng/checkbox';
import {Tooltip} from 'primeng/tooltip';
import {FormsModule} from '@angular/forms';
import {NgIf, NgStyle} from '@angular/common';
import {AppBaseFieldColumnComponent} from '../base/app-base-field-column-component';
import {AppTableColumn} from '../../model/app-table-interface';

@Component({
  selector: 'lib-app-checkbox-column',
  imports: [
    Checkbox,
    Tooltip,
    FormsModule,
    NgStyle,
    NgIf
  ],
  templateUrl: './app-checkbox-column.component.html',
  styleUrl: './app-checkbox-column.component.scss'
})
export class AppCheckboxColumnComponent extends AppBaseFieldColumnComponent implements OnChanges {
  booleanValue: boolean | undefined;

  onValueInitialize(): void {
    this.booleanValue = this.getBooleanValue(this.rowItem, this.column);
  }

  getBooleanValue(rowItem: any, column: AppTableColumn): boolean {
    const value = this.getValue();
    if (typeof value == 'boolean') {
      return value;
    }
    return value != null;
  }
}
