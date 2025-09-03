import {
  AfterContentInit,
  Component,
  ContentChildren,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output, QueryList, SimpleChanges, TemplateRef,
  ViewChild
} from '@angular/core';
import {FilterMetadata, MenuItem, PrimeTemplate, SortMeta, TableState} from 'primeng/api';
import {
  AppTableColumn,
  AppTableRowSelectEvent,
  AppTableRowUnSelectEvent,
  AppTableState
} from '../model/app-table-interface';
import {AppInternalKey, AppPageRequest, AppStyle, FilterUtils, Nullable} from 'mqml-angular-ui-sdk/api';
import {
  Table,
  TableColumnReorderEvent,
  TableFilterEvent,
  TableLazyLoadEvent, TableModule,
  TablePageEvent, TableRowCollapseEvent, TableRowExpandEvent,
  TableRowSelectEvent, TableRowUnSelectEvent
} from 'primeng/table';
import {
  AppTableColumnSelectionDialogComponent
} from '../app-table-column-selection-dialog.component/app-table-column-selection-dialog.component';
import {DecimalPipe, NgForOf, NgIf, NgStyle, NgTemplateOutlet} from '@angular/common';
import {cloneDeep} from 'lodash-es';
import {Badge} from 'primeng/badge';
import {Button} from 'primeng/button';
import {Skeleton} from 'primeng/skeleton';
import {Menu} from 'primeng/menu';
import {AppTableBodyColumnComponent} from '../column/app-table-body-column.component/app-table-body-column.component';
import {
  AppTableHeaderColumnComponent
} from '../column/app-table-header-column.component/app-table-header-column.component';

@Component({
  selector: 'lib-app-table',
  imports: [
    TableModule,
    Badge,
    NgIf,
    Button,
    Skeleton,
    NgStyle,
    NgForOf,
    Menu,
    NgTemplateOutlet,
    AppTableBodyColumnComponent,
    AppTableHeaderColumnComponent,
    AppTableColumnSelectionDialogComponent
  ],
  templateUrl: './app-table.component.html',
  styleUrl: './app-table.component.scss'
})
export class AppTableComponent implements AfterContentInit, OnChanges, OnInit {

  @Input() alwaysShowPaginator: boolean = true;
  @Input() autoLayout?: boolean = false;
  @Input() checkboxSelector: boolean = false;
  @Input() columnResizeMode: string = 'expand';
  @Input() columns: AppTableColumn[] | undefined;
  @Input() currentPageReportTemplate: string = 'Page {currentPage} of {totalPages}';
  @Input() dataKey: string | undefined;
  @Input() defaultColumns: AppTableColumn[] | undefined;
  @Input() editMode: 'cell' | 'row' = 'cell';
  @Input() emptyMessage: string = 'No Results';
  @Input() filterMenu: boolean = false;
  @Input() filters: { [s: string]: FilterMetadata | FilterMetadata[]; } = {};
  @Input() globalFilterFields: string[] | undefined;
  @Input() groupRowsBy: any;
  @Input() headerTitle: string | null | undefined;
  @Input() lazy: boolean = false;
  @Input() lazyLoadOnInit: boolean = true;
  @Input() loading: boolean = false;
  @Input() loadingIcon: string | undefined;
  @Input() menuItems: MenuItem[] = [];
  @Input() moreRecords?: boolean = false;
  @Input() multiSortMeta?: SortMeta[] | undefined;
  @Input() paginator: boolean = false;
  @Input() paginatorPosition: 'top' | 'bottom' | 'both' = 'top';
  @Input() paginatorStyleClass: string | undefined;
  @Input() reorderableColumns: boolean = false;
  @Input() resizableColumns: boolean = false;
  @Input() rowExpand: boolean = false;
  @Input() rowGroupMode: 'subheader' | 'rowspan' | undefined;
  @Input() rows: number = 50;
  @Input() rowSelectable: boolean | undefined | any;
  @Input() rowsPerPageOptions?: any[] = [10, 25, 50, 100];
  @Input() scrollable: boolean | undefined;
  @Input() scrollHeight: string | undefined;
  @Input() selectionMode: 'single' | 'multiple' | undefined | null;
  @Input() showCurrentPageReport?: boolean = true;
  @Input() sortMode: 'single' | 'multiple' = 'multiple';
  @Input() sortField: string | undefined;
  @Input() sortOrder: number = 1;
  @Input() selectColumns: boolean = true;
  @Input() skeletonColumns: number = 5;
  @Input() skeletonRows: number = 15;
  @Input() stateKey: string | undefined;
  @Input() stateStorage: 'session' | 'local' = 'local';
  @Input() style: AppStyle;
  @Input() styleClass: string | undefined;
  @Input() totalRecords: number | undefined;
  @Input() value: any[] = [];

  @Output() onSelectDeselectAllClick: EventEmitter<MouseEvent> = new EventEmitter<MouseEvent>()
  @Output() onStateRestore: EventEmitter<AppTableState> = new EventEmitter();
  @Output() onStateSave: EventEmitter<AppTableState> = new EventEmitter();
  @Output() onPageRequest: EventEmitter<AppPageRequest> = new EventEmitter();
  @Output() onRowSelect: EventEmitter<AppTableRowSelectEvent> = new EventEmitter();
  @Output() onRowUnSelect: EventEmitter<AppTableRowUnSelectEvent> = new EventEmitter();


  @ViewChild('table', {static: true}) table: Table | undefined;
  @ViewChild("columnSelectionDialog") private columnSelectionDialog: AppTableColumnSelectionDialogComponent | undefined;
  @ContentChildren(PrimeTemplate) templates: Nullable<QueryList<PrimeTemplate>>;

  /**
   * Available templates that could be provided
   */
  captionTemplate: Nullable<TemplateRef<any>>;
  headerTemplate: Nullable<TemplateRef<any>>;
  paginatorleftTemplate: Nullable<TemplateRef<any>>;
  paginatorrightTemplate: Nullable<TemplateRef<any>>;
  bodyTemplate: Nullable<TemplateRef<any>>;
  groupheaderTemplate: Nullable<TemplateRef<any>>;
  groupfooterTemplate: Nullable<TemplateRef<any>>;
  rowexpansionTemplate: Nullable<TemplateRef<any>>;
  summaryTemplate: Nullable<TemplateRef<any>>;
  _columns: AppTableColumn[] | undefined; //Selected columns
  _columnCount: number = 0;
  _filters: { [s: string]: FilterMetadata | FilterMetadata[]; } = {};
  _menuItems: MenuItem[] = [];
  _multiSortMeta: SortMeta[] | undefined;
  _pageReportTotalRecords: string = '';
  _pageReportTemplate: string = this.currentPageReportTemplate;
  _selectedColumnKeys: string[] | undefined;
  _selectedRows: any;
  _sortField: string | undefined;
  _sortOrder: number = 1;
  _totalRecords: number = 0;
  _totalRecordsReset: boolean = false;
  _value: any[] | undefined;

  protected readonly AppInternalKey = AppInternalKey;

  private defaultMenuItems: MenuItem[] = [
    {
      label: 'Clear Filters',
      icon: 'pi pi-filter-slash',
      command: () => this.clearFilters()
    },
    {
      label: 'Clear Sort',
      icon: 'pi pi-sort-alt-slash',
      command: () => this.clearSort()
    },
    {
      label: 'Restore Defaults',
      icon: 'pi pi-undo',
      command: () => this.restoreDefaults()
    },

  ]
  private refreshMenuItem: MenuItem = {
    label: 'Refresh',
    icon: 'fa-solid fa-arrow-rotate-right',
    command: (event) => this.refresh()
  }
  private selectColumnMenuItem: MenuItem = {
    label: 'Select Columns',
    icon: 'fa-solid fa-table-columns',
    command: () => {
      if (this.columns) {
        this.columnSelectionDialog?.show(this.columns, this._columns, this.defaultColumns)
      }
    }
  }

  constructor(private decimalPipe: DecimalPipe) {
  }

  ngAfterContentInit(): void {
    ['caption', 'header', 'paginatorleft', 'paginatorright', 'body', 'groupheader', 'groupfooter', 'rowexpansion'].forEach(name => {
      if (this.hasCustomTemplate(name)) {
        console.debug('Custom template found for:', name);
        (this as any)[`${name}Template`] = this.getCustomTemplate(name);
      }
    });
  }

  ngOnInit(): void {
    this.initMenu();
  }

  ngOnChanges(changes: SimpleChanges): void {

    if(changes['multiSortMeta']){
      this._multiSortMeta = this.multiSortMeta;
    }

    if(changes['sortField']){
      this._sortField = this.sortField;
    }

    if(changes['sortOrder']){
      this._sortOrder = this.sortOrder;
    }

    if(changes['filters']){
      this._filters = cloneDeep(this.filters);
    }

    //Initialize the menu if any of the properties are changed
    if (changes['menuItems'] || changes['lazy'] || changes['columns']) {
      this.initMenu();
    }

    if (changes['columns'] || changes['defaultColumns']) {
      this.initializeColumns();
    }

    if (changes['columns'] || changes['rowExpand']) {
      this._columnCount = this.getColumnCount();
    }

    if (changes['totalRecords']) {
      this._pageReportTotalRecords = this.getPageReportTotalRecords();
    }

    if (changes['currentPageReportTemplate'] || changes['moreRecords']) {
      this._pageReportTemplate = this.currentPageReportTemplate + (this.moreRecords ? '+' : '');
    }

    if (changes['totalRecords']) {
      this._totalRecords = this.getTotalRecords();
      this._pageReportTotalRecords = this.getPageReportTotalRecords();
    }

    if (changes['value']) {
      this.initializeValue();
    }

  }

  handleColumnReorder(event: TableColumnReorderEvent) {
    if (this.table) {
      this._selectedColumnKeys = event.columns?.map(column => column.key);
      this.initializeColumns();
      if (this.table.isStateful()) {
        this.table.saveState();
      }
    }
  }

  handleFilter(event: TableFilterEvent): void {
    if (this.table) {
      this.table.expandedRowKeys = {};
      // this._filteredOrDirty = this.isFilteredOrDirty();
    }
  }

  handleColumnSelection(selectedColumnKeys: string[]) {
    if (this.table) {
      this.table.expandedRowKeys = {}; // Clear out open rows.
      this._selectedColumnKeys = selectedColumnKeys;
      this.initializeColumns(); //Initialize columns after changes
      if (this.table.isStateful()) {
        setTimeout(() => this.table?.saveState());
      }
    }
  }

  handleLazyLoad(event: TableLazyLoadEvent): void {
    const pageRequest: AppPageRequest = this.buildPageRequest(event);
    this.onPageRequest.emit(pageRequest);
  }

  handlePage(event: TablePageEvent): void {
    if (this.table) {
      this.table.expandedRowKeys = {};
    }
  }

  handleSort(event: { multisortmeta: SortMeta[]; } | any): void {
    if (this.table) {
      this.table.expandedRowKeys = {};
    }
  }

  handleStateRestore(state: TableState): void {
    //Special handling to restore the sorting
    this._multiSortMeta = state.multiSortMeta || this.multiSortMeta;
    this._sortField = state.sortField || this.sortField;
    this._sortOrder = state.sortOrder || this.sortOrder;

    this.onStateRestore.emit({
      first: state.first,
      rows: state.rows,
      sortField: state.sortField,
      sortOrder: state.sortOrder,
      multiSortMeta: state.multiSortMeta,
      columnWidths: state.columnWidths,
      tableWidth: state.tableWidth,
      wrapperWidth: state.wrapperWidth,
      selection: state.selection,
      columnOrder: state.columnOrder,
      expandedRowKeys: state.expandedRowKeys
    });

  }

  handleStateSave(state: TableState): void {
    this.onStateSave.emit({
      first: state.first,
      rows: state.rows,
      sortField: state.sortField,
      sortOrder: state.sortOrder,
      multiSortMeta: state.multiSortMeta,
      columnWidths: state.columnWidths,
      tableWidth: state.tableWidth,
      wrapperWidth: state.wrapperWidth,
      selection: state.selection,
      columnOrder: state.columnOrder,
      expandedRowKeys: state.expandedRowKeys
    });
  }

  handleRowSelect(event: TableRowSelectEvent): void {
    this.onRowSelect.emit({
      data: event.data,
      type: event.type,
      originalEvent: event.originalEvent,
      index: event.index
    });
  }

  handleRowUnselect(event: TableRowUnSelectEvent<any>): void {
    this.onRowUnSelect.emit({
      data: event.data,
      type: event.type,
      originalEvent: event.originalEvent,
      index: event.index
    });
  }

  handleRowExpand(item: TableRowExpandEvent): void {
    // this.wbOnRowExpand.emit(item?.data);
  }

  handleRowCollapse(item: TableRowCollapseEvent): void {
    // this.wbOnRowExpand.emit(item?.data);
  }

  handleCheckboxAllSelectDeselect(event: MouseEvent): void {
    this.onSelectDeselectAllClick.emit(event);
  }

  isRowSelectable(event: any): boolean {
    //TODO: Must be implemented
    return true;
  }

  public filter(value: any, field: string, matchMode: string) {
    if (this.table) {
      this.table?.filter(value, field, matchMode);
    }
  }

  resetScrollTop(): void {
    if (this.table) {
      this.table.resetScrollTop();
    }
  }

  scrollTo(options: any): void {
    if (this.table) {
      this.table.scrollTo(options);
    }
  }

  public clear(): void {
    if (this.table) {
      if (this.table) {
        //Clear sort and restore defaults
        this.table.sortField = this._sortField = this.sortField;
        this.table.sortOrder = this._sortOrder = this.sortOrder;
        this.table.multiSortMeta = this._multiSortMeta = this.multiSortMeta;
        let sortMeta: SortMeta | SortMeta[] | null = null;
        if(this.sortMode === 'single' && this.sortField){
          sortMeta = {
            field: this.sortField,
            order: this.sortOrder
          };
        }else if(this.sortMode === 'multiple' && this.multiSortMeta){
          sortMeta = this.multiSortMeta;
        }
        this.table.tableService.onSort(sortMeta)

        //Clear filters
        this.clearFilterValues();
        this.table.filteredValue = null;

        if (this.table.isStateful()) {
          this.table.saveState();
        }
        this.refresh(true);
      }
    }
  }

  public clearFilterValues(): void {
    if (this.table) {
      this.table.clearFilterValues();
      //Remove multiple entries in array filter metadata
      for (const [key, filterMetadata] of Object.entries(this.table.filters)) {
        if (Array.isArray(filterMetadata)) {
          if(filterMetadata?.length) {
            this.table.filters[key] = [filterMetadata[0]];
          }
        }
      }
    }
  }

  public reset(): void {
    if (this.table) {
      this.table.reset();
    }
  }

  public saveState(): void {
    if (this.table) {
      this.table.saveState();
    }
  }

  public clearState(): void {
    if (this.table) {
      this.table.clearState();
    }
  }

  public restoreState(): void {
    if (this.table) {
      this.table.restoreState();
    }
  }


  /**
   * Refresh table
   * @param resetPage Boolean indicating if page reset is required
   */
  public refresh(resetPage: boolean = false): void {
    if (this.table && this.lazy) {
      this.table.restoringFilter = !resetPage; //This is to prevent reset page on refresh
      this.table._filter()
    }
  }

  /**
   * Start row processing for the provided index
   * @param rowIndex  Row index
   */
  public startRowProcessing(rowIndex: number): void {
    this.setRowProcessing(rowIndex, true);
  }

  /**
   * Stop row processing for the provided index
   * @param rowIndex Row index
   */
  public stopRowProcessing(rowIndex: number): void {
    this.setRowProcessing(rowIndex, false);
  }

  /**
   * Set row item at the provided index
   * @param rowIndex  Row index
   * @param rowItem   New row item
   */
  public setItem(rowIndex: number, rowItem: any): void {
    if (this._value !== undefined) {
      //Using Object.assign to force angular to detect changes
      this._value[rowIndex] = Object.assign({}, this.initializeItem(rowItem));
      this._value = [...this._value];
    }
  }

  private initializeValue(): void {
    this._value = this.value.map(item => this.initializeItem(item))
  }

  private initializeItem(item: any): any {
    item[AppInternalKey] = {
      processing: false
    }
    return item;
  }

  private setRowProcessing(rowIndex: number, processing: boolean): void {
    if (this._value !== undefined) {
      const AppInternal = this._value[rowIndex][AppInternalKey];
      if (AppInternal) {
        AppInternal.processing = processing;
      }
    }
  }

  private getPageReportTotalRecords(): string {
    if (this.totalRecords && this.totalRecords > 0) {
      return this.decimalPipe.transform(this.totalRecords) + (this.moreRecords ? '+' : '');
    }
    return '';
  }

  private getTotalRecords(): number {
    if (this._totalRecordsReset) {
      // Return 0 for total records to force actual total records to detected.
      this._totalRecordsReset = false;
      return 0;
    } else if (this.totalRecords && this.totalRecords > 0) {
      return this.totalRecords + (this.moreRecords ? 1 : 0);
    }
    return 0;
  }

  private getColumnCount(): number {
    let columnCount: number = 0;
    if (this.rowExpand)
      columnCount += 1;
    if (this._columns?.length) {
      columnCount += this._columns.filter(col => !col.hidden).length;
    }
    return columnCount;
  }

  private initializeColumns(): void {
    if (!this._selectedColumnKeys) {
      const state: TableState | null = this.getState();
      if (state && state.columnOrder && state.columnOrder.length > 0) {
        this._selectedColumnKeys = [...state.columnOrder];
      }
    }
    if (this._selectedColumnKeys) {
      const selectedColumns: AppTableColumn[] = [];
      this._selectedColumnKeys.forEach(columnKey => {
        const column = this.columns?.find(column => column.key === columnKey);
        if (column) {
          selectedColumns.push(column);
        }
      });
      this._columns = [...selectedColumns];
    } else if (this.defaultColumns?.length) {
      this._columns = [...this.defaultColumns];
    } else if (this.columns) {
      this._columns = [...this.columns];
    }
  }

  private getState(): TableState | null {
    if (this.table && this.stateKey) {
      const storage = this.table.getStorage();
      const stateString = storage.getItem(this.stateKey);
      if (stateString) {
        return JSON.parse(stateString);
      }
    }
    return null;
  }

  private initMenu(): void {
    const menuItems = [];
    if (this.lazy) {
      menuItems.push(this.refreshMenuItem)
    }
    if (this.columns?.length && this.selectColumns) {
      menuItems.push(this.selectColumnMenuItem);
    }
    menuItems.push({separator: true})
    menuItems.push(...this.defaultMenuItems);
    if (this.menuItems?.length) {
      menuItems.push({separator: true});
      menuItems.push(...this.menuItems);
    }
    this._menuItems = menuItems;
  }

  private buildPageRequest(event: TableLazyLoadEvent): AppPageRequest {
    const pageRequest: AppPageRequest = {
      offset: event.first || 0,
      limit: event.rows || this.rows,
      filter: [],
      sort: [],
      includeTotals: true //TODO: This is hardcoded but needs to be configurable at the table level
    };
    // Set sort
    const sortMeta: SortMeta[] = event.multiSortMeta || [];
    if (!event.multiSortMeta && event.sortField) {
      if (Array.isArray(event.sortField)) {
        event.sortField.forEach(field => sortMeta.push({field: field, order: event.sortOrder || 1}))
      } else {
        sortMeta.push({field: event.sortField, order: event.sortOrder || 1})
      }
    }
    if (sortMeta && sortMeta.length > 0) {
      sortMeta.forEach(sort => {
        if (sort?.field) {
          sort.field.split(",")
            .forEach(field => pageRequest.sort.push(`${field}  ${sort.order === 1 ? 'asc' : 'desc'}`));
        }
      });
    }
    // Set filters
    if (event.filters) {
      pageRequest.filter.push(...FilterUtils.stringifyMap(event.filters));
    }
    return pageRequest;
  }

  private getCustomTemplate(name: string): TemplateRef<any> | undefined {
    return this.templates?.find(template => template.name === name)?.template;
  }

  private hasCustomTemplate(name: string): boolean {
    if (this.templates?.length) {
      return this.templates.some(template => template.name === name);
    }
    return false;
  }

  ngAfterViewInit(): void {
    if (this.lazyLoadOnInit && this.table){
      this.table.restoreState();
      this.initializeColumns();
    }
  }


  private clearSort() {
    if (this.table) {
      //Clear sort and restore defaults
      this.table.sortField = this._sortField = this.sortField;
      this.table.sortOrder = this._sortOrder = this.sortOrder;
      this.table.multiSortMeta = this._multiSortMeta = this.multiSortMeta;
      let sortMeta: SortMeta | SortMeta[] | null = null;
      if(this.sortMode === 'single' && this.sortField){
        sortMeta = {
          field: this.sortField,
          order: this.sortOrder
        };
      }else if(this.sortMode === 'multiple' && this.multiSortMeta){
        sortMeta = this.multiSortMeta;
      }
      this.table.tableService.onSort(sortMeta)
      this.refresh(true);
    }
  }

  private clearFilters(){
    if (this.table) {
      this.clearFilterValues();
      this.table.filteredValue = null;
      this.refresh(true);
    }
  }

  public restoreDefaults(): void {
    if (this.table) {
      this.clearState();
      //Restore default sort
      this.table.sortField = this._sortField = this.sortField;
      this.table.sortOrder = this._sortOrder = this.sortOrder;
      this.table.multiSortMeta = this._multiSortMeta = this.multiSortMeta;
      let sortMeta: SortMeta | SortMeta[] | null = null;
      if(this.sortMode === 'single' && this.sortField){
        sortMeta = {
          field: this.sortField,
          order: this.sortOrder
        };
      }else if(this.sortMode === 'multiple' && this.multiSortMeta){
        sortMeta = this.multiSortMeta;
      }
      this.table.tableService.onSort(sortMeta);
      this.clearFilterValues();
      this.table.filteredValue = null;
      for (const [key, filterMetadata] of Object.entries(this.filters)) {
        if (Array.isArray(filterMetadata)) {
          this._filters[key] = cloneDeep(filterMetadata);
        }else {
          this._filters[key] = cloneDeep(filterMetadata);
        }
      }
      this._filters = Object.assign({}, this._filters);


      if (this.columns){
        if (this.defaultColumns){
          this._columns = [...this.defaultColumns];
        } else {
          this._columns = [...this.columns];
        }
      }
      setTimeout(() => {
        if (this.table?.isStateful()) {
          this.table?.saveState();
        }
        this.refresh(true);
      }, 0);

    }
  }
}
