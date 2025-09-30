import { Component } from '@angular/core';
import {AppBaseColumnComponent} from '../base/app-base-column-component';
import {AppTableColumnBodyTag, AppTableColumnType, AppTableStyle, AppTableTag} from '../../model/app-table-interface';
import {AppTagComponent} from 'mqml-angular-ui-sdk/tag';
import {NgForOf, NgIf} from '@angular/common';

@Component({
  selector: 'lib-app-tag-column',
  imports: [
    AppTagComponent,
    NgIf,
    NgForOf
  ],
  templateUrl: './app-tag-column.component.html',
  styleUrl: './app-tag-column.component.scss'
})
export class AppTagColumnComponent extends AppBaseColumnComponent {
  tags: AppTableTag[] = [];

  onInitialize(): void {
    this.tags = [];
    if (this.column?.body && this.isColumnType(AppTableColumnType.TAG)) {
      const body = (this.column.body as AppTableColumnBodyTag)
      if (typeof body.tagProvider === 'function') {
        this.tags = body.tagProvider(this.rowItem, this.rowIndex);
        this.tags.forEach((tag: AppTableTag)=> {
          tag._appInternal = {
            'style': this.getStyle(tag),
            'styleClass': this.getStyleClass(tag)
          };
        })
      }
    }
  }

  private getStyle(tag: AppTableTag): AppTableStyle {
    let style = tag.style || {};
    if(typeof tag.styleProvider === 'function'){
      style = Object.assign({}, style, tag.styleProvider(this.rowItem, this.rowIndex))
    }
    return style;
  }

  private getStyleClass(tag: AppTableTag): string {
    let styleClass = tag.styleClass || '';
    if(typeof tag.styleClassProvider === 'function'){
      styleClass += ` ${tag.styleClassProvider(this.rowItem, this.rowIndex)}`;
    }
    return `${styleClass} app-table-tag`;
  }
}
