import {Inject, Injectable} from '@angular/core';
import {DOCUMENT} from "@angular/common";
import {Clipboard} from "@angular/cdk/clipboard";

@Injectable({
  providedIn: 'root'
})
export class AppClipboardService {

  // @ts-ignore
  constructor(@Inject(DOCUMENT) private document: Document,
              private clipboard: Clipboard) {
  }

  copy(value: string | null): Promise<string> {
    const copied: boolean = this.clipboard.copy(value || '');
    return copied ? Promise.resolve(value || '') : Promise.reject('Failed to copy');
  }

  copyByElement(element: HTMLElement | null | undefined): Promise<string> {
    if (element) {
      return this.copy(element.textContent || element.innerText);
    }
    return Promise.reject('Element not available to copy');
  }

  copyByElementId(elementId: string): Promise<string> {
    return this.copyByElement(this.document.getElementById(elementId));
  }

}
