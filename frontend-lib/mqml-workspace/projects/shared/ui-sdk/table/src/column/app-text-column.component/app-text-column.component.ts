import { Component } from '@angular/core';
import {AppBaseFieldColumnComponent} from '../base/app-base-field-column-component';

@Component({
  selector: 'lib-app-text-column',
  imports: [],
  templateUrl: './app-text-column.component.html',
  styleUrl: './app-text-column.component.scss'
})
export class AppTextColumnComponent extends AppBaseFieldColumnComponent {

  onValueInitialize(): void {
    if (!this.column?.body?.tooltip?.value && !this.column?.body?.tooltip?.provider && this.dataComponent) {
      // If value and column element are provided,
      // check to see if is truncated. If it is
      // not truncated then do not set tooltip.
      if (this.dataComponent.value !== undefined) {
        let element = this.dataComponent?.columnElement?.nativeElement;
        if (element && element instanceof HTMLElement && this.isTextTruncated(element)) {
          if (Array.isArray(this.dataComponent.value)) {
            return this.dataComponent.value.join("<br>");
          }
          return this.dataComponent.value;
        }
      }
    }
  }

  protected isTextTruncated(element: Element): boolean {
    if (element) {
      if (element.children.length > 0) {
        // let elements = [...element.children];
        let elements = Array.from(element.children);
        return elements.findIndex(elem => elem.scrollWidth > elem.clientWidth) !== -1;
      }
      return element.scrollWidth > element.clientWidth;
    }
    return false;
  }


}
