import { Component } from '@angular/core';
import {AppBaseFieldColumnComponent} from '../base/app-base-field-column-component';
import {DatePipe} from '@angular/common';
import {AppTableColumnBodyDate} from '../../model/app-table-interface';

@Component({
  selector: 'lib-app-date-column',
  imports: [],
  providers: [DatePipe],
  templateUrl: './app-date-column.component.html',
  styleUrl: './app-date-column.component.scss'
})
export class AppDateColumnComponent extends AppBaseFieldColumnComponent {
  dateValue?: string | null;

  constructor(private datePipe: DatePipe) {
    super();
  }

  onValueInitialize(): void {
    if (this.value) {
      const format = (this.column?.body as AppTableColumnBodyDate).format || 'MM-dd-yyyy h:mma';
      this.dateValue = this.datePipe.transform(this.value, format);
    }
  }


}
