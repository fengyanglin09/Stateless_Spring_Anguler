import {Pipe, PipeTransform} from '@angular/core';
import {DomSanitizer, SafeHtml} from "@angular/platform-browser";

@Pipe({
  standalone: true,
  name: 'appSafeHtml'
})
export class AppSafeHtmlPipe implements PipeTransform {

  constructor(protected sanitizer: DomSanitizer) {}

  transform(value: any): SafeHtml {
    // const sanitizedContent = DOMPurify.sanitize(value);
    // return angular.bypassSecurityTrustHtml(sanitizedContent);
    return this.sanitizer.bypassSecurityTrustHtml(value);
  }

}
