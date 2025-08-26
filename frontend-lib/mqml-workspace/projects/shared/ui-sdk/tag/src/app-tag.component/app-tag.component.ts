import {Component, Input, OnChanges, SimpleChanges} from '@angular/core';
import {Tag} from 'primeng/tag';
import {NgClass, NgIf} from '@angular/common';
import {PrimeTemplate} from 'primeng/api';
import {AppStyle, AppTagSeverity} from 'mqml-angular-ui-sdk/api';
import {Tooltip} from 'primeng/tooltip';

@Component({
  selector: 'lib-app-tag',
  imports: [
    Tag,
    NgIf,
    PrimeTemplate,
    NgClass,
    Tooltip
  ],
  templateUrl: './app-tag.component.html',
  styleUrl: './app-tag.component.scss'
})
export class AppTagComponent implements OnChanges{

  @Input() value: string | undefined;
  @Input() severity: AppTagSeverity;
  @Input() icon: string | undefined;
  @Input() rounded: boolean = false;
  @Input() style: AppStyle;
  @Input() styleClass: string | undefined;
  @Input() tooltip: string | undefined;
  @Input() tooltipPosition: 'right' | 'left' | 'top' | 'bottom' | string | undefined;
  @Input() tooltipStyleClass: string | undefined;
  @Input() tooltipEscape: boolean | undefined = true;
  @Input() tooltipAppendTo: string | undefined;

  _styleClass: string | undefined;

  constructor() {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if(changes['styleClass']) {
      this._styleClass = `cad-tag ${this.styleClass || ''}`
    }
    if(changes['icon'] || changes['value']){
      if(this.icon && !this.value){
        this._styleClass += ' cad-tag-icon-only'
      }
    }
  }

}
