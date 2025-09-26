import { Component } from '@angular/core';
import {AppBaseFieldColumnComponent} from '../base/app-base-field-column-component';
import {AppTableColumnBodyNumber, AppTableColumnType} from '../../model/app-table-interface';

@Component({
  selector: 'lib-app-number-column',
  imports: [],
  templateUrl: './app-number-column.component.html',
  styleUrl: './app-number-column.component.scss'
})
export class AppNumberColumnComponent extends AppBaseFieldColumnComponent {

  locale: string = 'en-US';
  numberValue?: number;
  displayValue?: string;

  onValueInitialize(): void {
    this.numberValue = undefined;
    this.displayValue = undefined;
    if (this.value !== undefined && (this.column?.body && this.isColumnType(AppTableColumnType.NUMBER))) {
      const numberBody: AppTableColumnBodyNumber = this.column.body as AppTableColumnBodyNumber;
      this.numberValue = Number(this.value);
      this.displayValue = this.numberValue.toString();

      if (this.numberValue !== undefined) {
        if (numberBody.formatStyle) {
          this.displayValue = this.numberValue.toLocaleString(this.locale, {
            style: numberBody.formatStyle,
            currency: numberBody.formatCurrency || 'USD',
            currencyDisplay: numberBody.formatCurrencyDisplay,
            useGrouping: numberBody.formatUseGrouping,
            minimumIntegerDigits: numberBody.formatMinimumIntegerDigits,
            minimumFractionDigits: numberBody.formatMinimumFractionDigits,
            maximumFractionDigits: numberBody.formatMaximumFractionDigits,
            minimumSignificantDigits: numberBody.formatMinimumSignificantDigits,
            maximumSignificantDigits: numberBody.formatMaximumSignificantDigits
          });
        } else {
          this.displayValue = this.numberValue.toString();
        }
      }
    }
  }

}
