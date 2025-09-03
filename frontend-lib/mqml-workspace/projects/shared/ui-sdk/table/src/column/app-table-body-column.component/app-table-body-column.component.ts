import {Component, Input, OnChanges, SimpleChanges} from '@angular/core';
import {AppTableChip, AppTableColumn, AppTableColumnInstance, AppTableColumnType, AppTableTag} from '../../model/app-table-interface';


export interface AppTableRowItemColumn {
  styleClasses?: string,
  style?: any,
  disabled?: boolean,
  chips?: AppTableChip[],
  tags?: AppTableTag[]
}

@Component({
  selector: '[lib-app-table-body-column]',
  imports: [],
  templateUrl: './app-table-body-column.component.html',
  styleUrl: './app-table-body-column.component.scss'
})
export class AppTableBodyColumnComponent implements OnChanges{
  @Input()
  checkboxSelector: boolean = false;

  @Input({required: true})
  columns: AppTableColumn[] = [];

  @Input()
  expanded?: boolean = false;

  @Input()
  rowExpand?: boolean = false;

  @Input({required: true})
  rowIndex!: number;

  @Input({required: true})
  rowItem: any;

  @Input()
  processing: boolean = false;


  _rowItemColumns: AppTableRowItemColumn[] = [];
  _rowItemInstances: AppTableColumnInstance[] = [];
  protected readonly AppTableColumnType = AppTableColumnType;

  constructor() {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if ((changes['columns'] || changes['item'])) {
      this.initializeColumns();
    }
  }

  handleChipRemove(event: MouseEvent, chip: AppTableChip): void {
    chip.onRemove?.emit({
      event: event,
      value: chip.value,
      rowItem: this.rowItem,
      rowIndex: this.rowIndex
    });
  }

  private initializeColumns(): void {
    this._rowItemColumns = [];
    this._rowItemInstances = [];
    if (this.columns?.length) {
      this.columns.forEach(column => {
        this._rowItemColumns.push(this.initializeColumn(column));
        this._rowItemInstances.push(new AppTableColumnInstance(column))
      })
    }
  }

  private initializeColumn(column: AppTableColumn): AppTableRowItemColumn {
    const styleClasses: string = this.getContentStyleClasses(column);
    const style: any = this.getContentStyle(column);
    const disabled: boolean = this.isDisabled(column);

    return {
      styleClasses: styleClasses,
      style: style,
      disabled: disabled,
      chips: [],
      tags: []
    };
  }

  private getContentStyleClasses(column: AppTableColumn): string {
    const classes: string[] = [...this.getHeaderContentStyleClasses(column)];
    if (column?.body) {
      if (column?.body.click && !this.isDisabled(column)) {
        classes.push('cursor-pointer');
      }
      if (column?.body?.type === AppTableColumnType.MENU ) {
        classes.push('App-menu-column');
      }
      if (column?.body?.styleClass) {
        classes.push(column?.body.styleClass);
      }
      if (column?.body?.styleClassProvider) {
        classes.push(column.body.styleClassProvider(this.rowItem, this.rowIndex));
      }
    }
    return classes.join(' ');
  }

  private getHeaderContentStyleClasses(column: AppTableColumn): string[] {
    const classes: string[] = [];
    if (column?.styleClass) {
      classes.push(column?.styleClass);
    }
    return classes;
  }

  private isDisabled(column: AppTableColumn): boolean {
    if (column?.body?.disabledProvider) {
      return column.body.disabledProvider(this.rowItem, this.rowIndex);
    }
    return false;
  }

  private getContentStyle(column: AppTableColumn): any {
    if (typeof column?.body?.styleProvider === 'function') {
      return column?.body.styleProvider(this.rowItem, this.rowIndex);
    } else if (column?.body?.style) {
      return column?.body.style;
    }
    return '';
  }
}
