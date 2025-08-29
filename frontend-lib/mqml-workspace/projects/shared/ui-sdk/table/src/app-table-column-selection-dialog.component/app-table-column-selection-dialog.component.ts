import {Component, EventEmitter, Input, Output, ViewChild} from '@angular/core';
import {CDK_DRAG_CONFIG} from '@angular/cdk/drag-drop';
import {PickList} from 'primeng/picklist';
import {AppDialogComponent} from '../../../dialog';
import {AppTableColumn} from '../model/app-table-interface';
import {AppTagComponent} from '../../../tag';
import {PrimeTemplate} from 'primeng/api';
import {ButtonDirective} from 'primeng/button';
import {NgIf} from '@angular/common';


interface AppColumnMetadata {
  key: string;
  title: string;
  default: boolean;
}

// Set zIndex for drag element
const DragConfig = {
  dragStartThreshold: 0,
  pointerDirectionChangeThreshold: 5,
  zIndex: 9999
};

@Component({
  selector: 'lib-app-table-column-selection-dialog',
  imports: [
    AppDialogComponent,
    AppTagComponent,
    PrimeTemplate,
    ButtonDirective,
    PickList,
    NgIf
  ],
  templateUrl: './app-table-column-selection-dialog.component.html',
  styleUrl: './app-table-column-selection-dialog.component.scss',
  providers: [
    {
      provide: CDK_DRAG_CONFIG,
      useValue: DragConfig
    }
  ]
})
export class AppTableColumnSelectionDialogComponent {
  @Input() reorderable: boolean = true;

  @Output() onChange: EventEmitter<any> = new EventEmitter();

  @ViewChild("dialog") private dialog: AppDialogComponent | undefined;
  @ViewChild("columnList") private columnList: PickList | undefined;

  public allColumns: AppTableColumn[] = [];
  public availableColumns: AppColumnMetadata[] = [];
  public defaultColumnKeys: string[] = [];
  public defaultColumns: AppColumnMetadata[] = [];
  public processing: boolean = false;
  public selectedColumns: AppColumnMetadata[] = [];
  public showRestoreDefaults: boolean = false;

  constructor() {
  }

  show(availableColumns: AppTableColumn[], selectedColumns: AppTableColumn[] | undefined, defaultColumns: AppTableColumn[] | undefined) {

    this.allColumns = [...availableColumns];
    this.defaultColumnKeys = defaultColumns?.map(column => column.key) || [];

    if (defaultColumns && defaultColumns.length > 0) {
      this.defaultColumns = defaultColumns
        .filter(column => column && column?.reorderable !== false)
        .map(column => this.getColumnMetadata(column));
    }else {
      this.defaultColumns = [];
    }

    if(selectedColumns) {
      this.selectedColumns = selectedColumns
        .filter(column => column && column?.reorderable !== false)
        .map(column => this.getColumnMetadata(column)) ;
    }else {
      this.selectedColumns = []
    }

    this.setShowRestoreDefaultColumns();
    this.setAvailableColumns();
    this.dialog?.show();
  }

  hide(): void {
    this.dialog?.hide();
  }

  /**
   * Method used to lock the form field and set the processing state (on save).
   */
  startProcessing(): void {
    this.processing = true;
  }

  /**
   * Method used to unlock the form field and remove the processing state (on save).
   */
  stopProcessing(): void {
    this.processing = false;
  }

  setAvailableColumns(): void {
    this.availableColumns = this.allColumns
      .filter(column => column && column?.reorderable !== false)
      .filter(column => !this.columnExistsByKey(this.selectedColumns, column.key))
      .map(column => this.getColumnMetadata(column));
  }

  getColumnMetadata(column: AppTableColumn): AppColumnMetadata {
    return {
      key: column.key,
      title: column.header && column.header.title ? column.header.title : column.key,
      default: this.defaultColumnKeys?.length ? this.defaultColumnKeys.includes(column.key) : false
    };
  }

  restore() {
    this.startProcessing();
    // Slow it down for a visual haptic feedback.
    // setTimeout(() => {
    if (this.defaultColumns.length > 0) {
      this.selectedColumns = [...this.defaultColumns];
    } else {
      this.selectedColumns = [...this.allColumns
        .filter(column => column && column?.reorderable !== false)
        .map(column => this.getColumnMetadata(column))
      ];
    }
    this.setAvailableColumns();
    if(this.columnList) {
      this.columnList.resetFilter();
    }
    this.stopProcessing();
    // }, 1000);
  }

  save() {
    this.startProcessing();
    const columns:string[] = [];
    // Add static columns
    columns.push(...this.allColumns
      .filter(column => column && column?.reorderable === false)
      .map(column => column.key)
    );
    // Add selected columns
    columns.push(...this.selectedColumns
      .map(column => column.key)
    );
    this.onChange.emit(columns);
    this.hide();
    this.stopProcessing();
  }

  private columnExistsByKey(columns: AppColumnMetadata[], columnKey: string): boolean {
    return columns && columns.some(meta=>meta.key === columnKey);
  }

  private columnExistsByKeyAndIndex(columns: AppColumnMetadata[], columnKey: string, index: number): boolean {
    return columns && columns.some(((meta,metaIndex)=>meta.key === columnKey && metaIndex === index));
  }

  private setShowRestoreDefaultColumns() {
    this.showRestoreDefaults = this.defaultColumns?.length > 0 &&
      (this.defaultColumns.length !== this.selectedColumns.length ||
        !this.defaultColumns.every((col, i) => this.columnExistsByKeyAndIndex(this.selectedColumns, col.key, i)));
  }
}
