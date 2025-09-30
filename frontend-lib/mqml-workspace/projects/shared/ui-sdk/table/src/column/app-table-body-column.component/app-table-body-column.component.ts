import {Component, Input, OnChanges, SimpleChanges} from '@angular/core';
import {AppTableChip, AppTableColumn, AppTableColumnInstance, AppTableColumnType, AppTableTag} from '../../model/app-table-interface';
import {TableModule} from 'primeng/table';
import {ButtonDirective} from 'primeng/button';
import {
  NgClass,
  NgForOf,
  NgIf,
  NgStyle,
  NgSwitch,
  NgSwitchCase,
  NgSwitchDefault,
  NgTemplateOutlet
} from '@angular/common';
import {ProgressSpinner} from 'primeng/progressspinner';
import {Tooltip} from 'primeng/tooltip';
import {AppCheckboxColumnComponent} from '../app-checkbox-column.component/app-checkbox-column.component';
import {AppDateColumnComponent} from '../app-date-column.component/app-date-column.component';
import {Chip} from 'primeng/chip';
import {AppMenuColumnComponent} from '../app-menu-column.component/app-menu-column.component';
import {AppNumberColumnComponent} from '../app-number-column.component/app-number-column.component';
import {AppRouteColumnComponent} from '../app-route-column.component/app-route-column.component';
import {AppTagColumnComponent} from '../app-tag-column.component/app-tag-column.component';
import {AppTextColumnComponent} from '../app-text-column.component/app-text-column.component';


export interface AppTableRowItemColumn {
  styleClasses?: string,
  style?: any,
  disabled?: boolean,
  chips?: AppTableChip[],
  tags?: AppTableTag[]
}

@Component({
  selector: '[lib-app-table-body-column]',
  imports: [
    TableModule,
    ButtonDirective,
    NgClass,
    NgForOf,
    NgStyle,
    ProgressSpinner,
    NgIf,
    Tooltip,
    NgSwitch,
    AppCheckboxColumnComponent,
    NgSwitchCase,
    AppDateColumnComponent,
    Chip,
    AppMenuColumnComponent,
    AppNumberColumnComponent,
    AppRouteColumnComponent,
    AppTagColumnComponent,
    AppTextColumnComponent,
    NgSwitchDefault,
    NgTemplateOutlet
  ],
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
