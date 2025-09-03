import {Component, EventEmitter, Input, Output, SimpleChanges} from '@angular/core';
import {AppTableColumn, AppTableColumnType} from '../../model/app-table-interface';
import { AppInternalKey } from 'mqml-angular-ui-sdk/api';
import {TableModule} from 'primeng/table';
import {NgClass, NgForOf, NgIf, NgStyle, NgSwitch, NgSwitchCase} from '@angular/common';
import {Tooltip} from 'primeng/tooltip';
import {Listbox} from 'primeng/listbox';
import {FormsModule} from '@angular/forms';
import {Select} from 'primeng/select';
import {DatePicker} from 'primeng/datepicker';

@Component({
  selector: '[lib-app-table-header-column]',
  imports: [
    TableModule,
    NgForOf,
    Tooltip,
    NgClass,
    NgStyle,
    NgSwitch,
    NgSwitchCase,
    Listbox,
    FormsModule,
    Select,
    DatePicker,
    NgIf
  ],
  templateUrl: './app-table-header-column.component.html',
  styleUrl: './app-table-header-column.component.scss'
})
export class AppTableHeaderColumnComponent {
  @Input() checkboxSelector: boolean = false;
  @Input() selectionMode: 'single' | 'multiple' | undefined | null;
  @Input() columns: any[] = [];
  @Input() queueFilters?: boolean = true;
  @Input() mode?: string = 'basic'; // basic, lazy, paginated
  @Input() rowExpand?: boolean = false;

  @Output() onSelectDeselectAllClick: EventEmitter<MouseEvent> = new EventEmitter<MouseEvent>();
  protected readonly AppInternalKey = AppInternalKey;

  constructor() {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['columns'] && this.columns?.length) {
      this.columns.forEach(column => {
        if (column) {
          column[AppInternalKey] = {
            tooltip: {
              value: this.getTooltip(column),
              position: this.getTooltipPosition(column),
              styleClass: this.getTooltipStyleClasses(column),
            },
            style: this.getStyle(column),
            styleClass: this.getStyleClasses(column)
          };
        }
      });
    }
  }

  handleCheckboxAllSelectDeselect(event: MouseEvent): void {
    this.onSelectDeselectAllClick.emit(event);
  }

  private getTooltip(column: AppTableColumn): string {
    if (column?.header?.tooltip) {
      return column.header.tooltip.value;
    }
    return "";
  }

  private getTooltipPosition(column: AppTableColumn): string {
    if (column?.header?.tooltip?.position) {
      return column.header.tooltip.position;
    }
    return 'top';
  }

  private getTooltipStyleClasses(column: AppTableColumn): string {
    const classes: string[] = [];
    if (column?.header?.tooltip?.styleClass) {
      classes.push(column.header.tooltip.styleClass);
    }
    return classes.join(' ');
  }

  private getStyleClasses(column: AppTableColumn): string {
    const classes: string[] = [...this.getContentStyleClasses(column)];
    if (column?.header?.styleClass) {
      classes.push(column?.header.styleClass);
    }
    return classes.join(' ');
  }

  private getContentStyleClasses(column: AppTableColumn): string[] {
    const classes: string[] = [];
    if (column?.styleClass) {
      classes.push(column.styleClass);
    }
    if (column?.body?.type === AppTableColumnType.MENU) {
      classes.push('App-menu-header')
    }
    return classes;
  }

  private getStyle(column: AppTableColumn): { [key: string]: any; } | null | undefined {
    if (column?.header?.style) {
      return column.header.style;
    }
    return null;
  }
}
