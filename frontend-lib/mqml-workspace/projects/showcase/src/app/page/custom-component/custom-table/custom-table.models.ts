import {AppTableColumn} from 'mqml-angular-ui-sdk/table/src/model/app-table-interface';
import {FilterMetadata} from 'primeng/api';

export class TableConfiguration {
  loading: boolean = false;
  columns: AppTableColumn[] = [];
  defaultColumns: AppTableColumn[] = [];
  records: any[] = [];
  totalRecords: number | undefined;
  filters: { [s: string]: FilterMetadata | FilterMetadata[]; } = {};

  constructor(data: Partial<TableConfiguration>) {
    Object.assign(this, data)
  }
}
