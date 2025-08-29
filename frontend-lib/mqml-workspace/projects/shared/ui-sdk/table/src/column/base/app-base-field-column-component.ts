import {Directive, OnChanges} from '@angular/core';
import {AppBaseColumnComponent} from './app-base-column-component';
import {AppTableColumnField} from '../../model/app-table-interface';
import {get} from "lodash-es";
@Directive()
export abstract class AppBaseFieldColumnComponent extends AppBaseColumnComponent implements OnChanges{

  value: any;

  public onInitialize(): void {
    this.value = undefined;
    if (this.rowItem && this.column) {
      this.value = this.getValue();
    }
    this.onValueInitialize();
  }

  public abstract onValueInitialize(): void;

  protected getValue(): any {
    if (this.isFieldColumn()) {
      const body = this.column.body as AppTableColumnField
      if (typeof body.valueProvider === 'function') {
        return body.valueProvider(this.rowItem, this.rowIndex);
      } else if (body?.field) {
        return this.getFieldValue(this.rowItem, body.field, body.defaultValue);
      }
    }
    return undefined;
  }

  protected isFieldColumn(): boolean {
    const fieldColumn: AppTableColumnField = this.column.body as AppTableColumnField;
    return fieldColumn.field !== undefined
      || fieldColumn.defaultValue !== undefined
      || fieldColumn.valueProvider !== undefined;
  }


  /**
   * rowItem = { user: { name: "Alice", age: 30 } }
   * field = "user.name"
   * defaultValue = "Unknown"
   * The code get(rowItem, field, defaultValue) will return "Alice" because it finds rowItem.user.name.
   * If field was "user.email", it would return "Unknown" since that property does not exist.
   * */

  private getFieldValue(rowItem: any, field: string, defaultValue?: any): any {
    if (field) {
      return get(rowItem, field, defaultValue);
    }
    return defaultValue ? defaultValue : rowItem;
  }


}
