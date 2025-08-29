import {EventEmitter, TemplateRef} from "@angular/core";
import {FilterMetadata, MenuItem, SelectItem, SortMeta} from "primeng/api";
import {AppOption, AppStyle, AppTag, AppWithInternal} from 'mqml-angular-ui-sdk/api';


export interface AppTableRowSelectEvent {
    originalEvent?: Event;
    data?: any;
    type?: string;
    index?: number;
}

export interface AppTableRowUnSelectEvent extends AppTableRowSelectEvent {

}

export interface AppTableState {
    first?: number;
    rows?: number;
    sortField?: string;
    sortOrder?: number;
    multiSortMeta?: SortMeta[];
    filters?: {
        [s: string]: FilterMetadata | FilterMetadata[];
    };
    columnWidths?: string;
    tableWidth?: string;
    wrapperWidth?: string;
    selection?: any;
    columnOrder?: string[];
    expandedRowKeys?: {
        [s: string]: boolean;
    };
}

export interface AppTableColumn extends AppTableStyle {
    key: string;
    header?: AppTableColumnHeader;
    body?: AppTableColumnBodyText | AppTableColumnBodyNumber | AppTableColumnBodyCheckbox | AppTableColumnBodyTag | AppTableColumnBodyDate | AppTableColumnBodyTemplate | AppTableColumnBodyMenu | AppTableColumnBodyRoute;
    filter?: AppTableColumnFilter<AppTableFilterType> | AppTableColumnFilterDate | AppTableColumnFilterSelect;
    sort?: AppTableColumnSort;
    frozen?: boolean;
    hidden?: boolean;
    resizable?: boolean;
    reorderable?: boolean;
}


export interface AppTableColumnFilter<T extends AppTableFilterType> {
    type: T;
    field: string;
    display?: 'menu' | 'row' | string;
    matchMode?: string;
    matchModeOptions?: SelectItem[];
    operator?: string;
    showAddButton?: boolean;
    showApplyButton?: boolean;
    showClearButton?: boolean;
    showMatchModes?: boolean;
    showMenu?: boolean;
    showOperator?: boolean;
}

export interface AppTableColumnFilterDate extends AppTableColumnFilter<AppTableFilterType.DATE> {
    type: AppTableFilterType.DATE;
    dateFormat?: string;
}

export interface AppTableColumnFilterSelect extends AppTableColumnFilter<AppTableFilterType.SELECT | AppTableFilterType.MULTISELECT> {
    type: AppTableFilterType.SELECT | AppTableFilterType.MULTISELECT;
    filterOptions?: AppOption[];
}

export interface AppTableColumnSort {
    field: string;
    disabled?: boolean;
}

export interface AppTableColumnHeader extends AppTableStyle {
    title?: string;
    icon?: string;
    tooltip?: AppTableTooltip;
}

export interface AppTableColumnBody<T extends AppTableColumnType> extends AppTableStyle {
    type: T;
    tooltip?: AppTableTooltip;
    click?: ((item: any, column: AppTableColumnInstance, rowIndex: number) => void);
    disabledProvider?: ((rowItem: any, rowIndex: number) => boolean);
    statusTabProvider?: ((rowItem: any, rowIndex: number) => any); // TODO: Check if we need this feature for v1
    // chipProvider?: ((rowData: any) => AppTableChip[]);
    // tagProvider?: ((rowData: any) => AppTableTag[]);
}

export interface AppTableColumnField {
    field?: any | null;
    defaultValue?: any;
    valueProvider?: ((rowItem: any, rowIndex: number) => any);
}

export interface AppTableColumnBodyText extends AppTableColumnBody<AppTableColumnType.TEXT>, AppTableColumnField {
    type: AppTableColumnType.TEXT;
}

export interface AppTableColumnBodyNumber extends AppTableColumnBody<AppTableColumnType.NUMBER>, AppTableColumnField {
    type: AppTableColumnType.NUMBER;
    formatStyle?: 'decimal' | 'currency' | 'percent',
    formatLocale?: string,
    formatCurrency?: string;
    formatCurrencyDisplay?: 'symbol' | 'code' | 'name'
    formatUseGrouping?: boolean;
    formatMinimumIntegerDigits?: number,
    formatMinimumFractionDigits?: number,
    formatMaximumFractionDigits?: number,
    formatMinimumSignificantDigits?: number,
    formatMaximumSignificantDigits?: number
}


//Add AppTableColumnBodyNumber, AppTableColumnBodyTemplate, AppTableColumnBodyMenu

export interface AppTableColumnBodyDate extends AppTableColumnBody<AppTableColumnType.DATE>, AppTableColumnField {
    type: AppTableColumnType.DATE;
    format?: string;
}

export interface AppTableColumnBodyCheckbox extends AppTableColumnBody<AppTableColumnType.CHECKBOX>, AppTableColumnField {
    type: AppTableColumnType.CHECKBOX;
}

export interface AppTableColumnBodyTag extends AppTableColumnBody<AppTableColumnType.TAG> {
    type: AppTableColumnType.TAG;
    tagProvider?: ((rowItem: any, rowIndex: number) => AppTableTag[]);
}

export interface AppTableColumnBodyTemplate extends AppTableColumnBody<AppTableColumnType.TEMPLATE> {
    type: AppTableColumnType.TEMPLATE;
    templateProvider: (() => TemplateRef<any>);
}

export interface AppTableColumnBodyMenu extends AppTableColumnBody<AppTableColumnType.MENU> {
    type: AppTableColumnType.MENU;
    menuItemProvider: ((rowItem: any, rowIndex: number) => MenuItem[]);
    icon?: string;
    iconClass?: string;
}

export interface AppTableColumnBodyRoute extends AppTableColumnBody<AppTableColumnType.ROUTE>, AppTableColumnField {
    type: AppTableColumnType.ROUTE;
    url?: string;
    urlProvider?: ((rowData: any) => string);
    queryParamsProvider?: ((rowItem: any, rowIndex: number) => any);
}

export interface AppTableTooltip {
    value: string;
    position?: 'right' | 'left' | 'top' | 'bottom' | undefined;
    styleClass?: string;
    provider?: ((rowData: any) => string);
}

export interface AppTableStyle {
    style?: AppStyle;
    styleProvider?: (rowItem: any, rowIndex: number) => any | undefined;
    styleClass?: string | undefined;
    styleClassProvider?: ((rowItem: any, rowIndex: number) => any) | undefined;
}

export class AppTableColumnInstance {
    column?: AppTableColumn;
    loading?: boolean = false;

    constructor(column: AppTableColumn) {
        this.column = column;
    }
}

export interface AppTableTag extends AppTag, AppTableStyle, AppWithInternal {

}

export interface AppTableChipRemoveEvent {
    event: MouseEvent,
    value: any,
    rowItem: any,
    rowIndex: number
}

export interface AppTableChip extends AppTableStyle {
    value?: string;
    icon: string | undefined;
    image: string | undefined;
    indicator?: string;
    removable?: boolean;
    onRemove?: EventEmitter<AppTableChipRemoveEvent>;
}

export enum AppTableColumnType {
    CHECKBOX = "CHECKBOX",
    DATE = "DATE",
    ROUTE = "ROUTE",
    TAG = "TAG",
    TEXT = "TEXT",
    NUMBER = "NUMBER",
    TEMPLATE = "TEMPLATE",
    MENU = "MENU"
}

export enum AppTableFilterType {
    TEXT = "text",
    MULTISELECT = "multiselect",
    NUMERIC = "numeric",
    SELECT = "select",
    BOOLEAN = "boolean",
    DATE = "date"
}
