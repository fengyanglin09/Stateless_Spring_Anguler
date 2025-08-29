import {Directive, Input, OnChanges, SimpleChanges, ViewChild} from '@angular/core';
import {AppTableColumn, AppTableColumnInstance, AppTableColumnType} from '../../model/app-table-interface';


/**
 *
 * The @Directive() decorator is necessary if you want Angular to process the base class for dependency injection, lifecycle hooks, and property bindings.
 * Without it, Angular will not treat the class as a directive, and features like @Input() and @ViewChild() will not work in the base class.
 * This enables subclasses to inherit Angular functionality.
 *
 * */

@Directive()
export abstract class AppBaseColumnComponent implements OnChanges{

  @Input({required: true})
  rowIndex!: number;

  @Input({required: true})
  rowItem!: any;

  @Input({required: true})
  column!: AppTableColumn;

  @Input({required: true})
  columnInstance!: AppTableColumnInstance;

  @Input()
  processing: boolean = false;

  @ViewChild("dataComponent")
  dataComponent: any;

  // value: any;
  disabled: boolean = false;
  tooltipContent: string | undefined;
  tooltipPosition: 'right' | 'left' | 'top' | 'bottom' | undefined = 'top';
  tooltipStyleClass: string | undefined;


  ngOnChanges(changes: SimpleChanges): void {
    if (changes['rowItem']) {
      this.initialize();
    }
    this.disabled = this.isDisabled();
  }


  /**
   * The selected line declares an abstract method named onInitialize in the AppBaseColumnComponent abstract class.
   * Subclasses must implement this method to provide custom initialization logic when the component's data changes.
   * */
  public abstract onInitialize(): void;

  protected initialize(): void {
    if (this.rowItem && this.column) {
      // this.value = this.getValue(this.column, this.rowItem);
      this.disabled = this.isDisabled();
      this.tooltipContent = this.getTooltipContent();
      this.tooltipPosition = this.getTooltipPosition();
      this.tooltipStyleClass = this.getTooltipStyleClasses();
    } else {
      // this.value = undefined;
      this.disabled = false;
      this.tooltipContent = undefined;
      this.tooltipPosition = 'top';
      this.tooltipStyleClass = undefined;
    }
    this.onInitialize();
  }

  protected getTooltipPosition(): 'right' | 'left' | 'top' | 'bottom' | undefined {
    if (this.column?.body?.tooltip?.position) {
      return this.column.body.tooltip.position;
    }
    return 'top';
  }

  protected getTooltipContent(): string {
    if (this.column?.body?.tooltip?.value) {
      return this.column?.body?.tooltip?.value
    } else if (this.column?.body?.tooltip?.provider) {
      return this.column?.body?.tooltip?.provider(this.rowItem);
    }
    return "";
  }

  protected getTooltipStyleClasses(): string {
    const classes: string[] = [];
    if (this.column && this.column?.body?.tooltip?.styleClass) {
      classes.push(this.column.body.tooltip.styleClass);
    }
    return classes.join(' ');
  }

  protected isDisabled(): boolean {
    if (this.column && this.column?.body?.disabledProvider) {
      return this.column.body.disabledProvider(this.rowItem, this.rowIndex);
    }
    return false;
  }

  protected isColumnType(columnType: AppTableColumnType): boolean {
    return this.column.body?.type === columnType;
  }

}
