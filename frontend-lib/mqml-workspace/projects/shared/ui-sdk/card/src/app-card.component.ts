import {AfterContentInit, Component, ContentChildren, Input, QueryList, TemplateRef} from '@angular/core';
import {Card} from 'primeng/card';
import {NgIf, NgTemplateOutlet} from '@angular/common';
import {PrimeTemplate} from 'primeng/api';
import {AppStyle, Nullable} from 'mqml-angular-ui-sdk/api';

@Component({
  selector: 'lib-app-card',
  imports: [
    Card,
    NgIf,
    PrimeTemplate,
    NgTemplateOutlet
  ],
  templateUrl: './app-card.component.html',
  styleUrl: './app-card.component.scss'
})
export class AppCardComponent implements AfterContentInit {


  @Input() header: string | undefined;
  @Input() subheader: string | undefined;
  @Input() style: AppStyle;
  @Input() styleClass: string | undefined;

  @ContentChildren(PrimeTemplate) templates: Nullable<QueryList<PrimeTemplate>>;

  headerTemplate: Nullable<TemplateRef<any>>;
  titleTemplate: Nullable<TemplateRef<any>>;
  subtitleTemplate: Nullable<TemplateRef<any>>;
  contentTemplate: Nullable<TemplateRef<any>>;
  footerTemplate: Nullable<TemplateRef<any>>;

  ngAfterContentInit(): void {
    ['header', 'title', 'subtitle', 'content', 'footer'].forEach(name => {
      if (this.hasCustomTemplate(name)) {
        (this as any)[`${name}Template`] = this.getCustomTemplate(name);
      }
    });
  }

  private getCustomTemplate(name: string): TemplateRef<any> | undefined {
    return this.templates?.find(template => template.name === name)?.template;
  }

  private hasCustomTemplate(name: string): boolean {
    if(this.templates?.length){
      return this.templates.some(template => template.name === name);
    }
    return false;
  }

}
