import {
  AfterViewInit,
  Component,
  ContentChildren, ElementRef,
  EventEmitter,
  Input,
  Output, QueryList,
  TemplateRef,
  ViewChild
} from '@angular/core';
import {AppClipboardService, AppSafeHtmlPipe, AppTag} from 'mqml-angular-ui-sdk/api';
import {AppContentOverflowEllipsisComponent} from 'mqml-angular-ui-sdk/content-overflow-ellipsis';
import {PrimeTemplate} from 'primeng/api';
import {NgClass, NgForOf, NgIf} from '@angular/common';
import {Tooltip} from 'primeng/tooltip';
import {AppTagComponent} from 'mqml-angular-ui-sdk/tag';
import {Skeleton} from 'primeng/skeleton';

@Component({
  selector: 'lib-app-label-field.component',
  imports: [
    NgClass,
    NgIf,
    Tooltip,
    NgForOf,
    AppTagComponent,
    AppContentOverflowEllipsisComponent,
    AppSafeHtmlPipe,
    Skeleton
  ],
  templateUrl: './app-label-field.component.html',
  styleUrl: './app-label-field.component.scss'
})
export class AppLabelFieldComponent implements AfterViewInit{
  /** Input(s) **/
  @Input() infoIcon: string = 'fa-solid fa-info-circle';
  @Input() infoTooltip?: string | TemplateRef<any>| undefined;
  @Input() infoTooltipAutoHide: boolean = false;
  @Input() infoTooltipEscape: boolean = false;
  @Input() infoTooltipStyleClass?: string | undefined;
  @Input() label: string | undefined;
  @Input() loading: boolean = false;
  @Input() maxWidth: number = 300;
  @Input() overflowEllipsis: boolean = true;
  @Input() styleClass?: string;
  @Input() tags?: AppTag[];
  @Input() tooltip?: string = undefined;
  @Input() tooltipAppendTo?: any = "body";
  @Input() tooltipPosition?: string = undefined;
  @Input() value?: string | TemplateRef<any> | undefined;
  @Input() valueStyleClass?: string | undefined;

  @Output() onCopySuccess: EventEmitter<string> = new EventEmitter<string>()
  @Output() onCopyError: EventEmitter<string> = new EventEmitter<string>()

  @ViewChild('contentContainer') containerElement!: ElementRef;
  @ViewChild('contentOverflowEllipsis') contentOverflowElement!: AppContentOverflowEllipsisComponent;
  @ContentChildren(PrimeTemplate) templates!: QueryList<PrimeTemplate>;

  toolbarTemplate: TemplateRef<any> | undefined;

  constructor(private clipboardService: AppClipboardService) {
  }

  ngAfterViewInit(): void {
    this.toolbarTemplate = this.getTemplate('toolbar');
  }

  async copyToClipboard(): Promise<void> {
    if (this.overflowEllipsis) {
      return this.contentOverflowElement.copyToClipboard();
    } else if (this.containerElement?.nativeElement) {
      return this.clipboardService.copyByElement(this.containerElement.nativeElement)
        .then((value: string) => {
          this.onCopySuccess.emit(value);
        })
        .catch((error: string) => {
          this.onCopyError.emit(error);
        });
    }
  }

  handleCopySuccess(value: string): void {
    this.onCopySuccess.emit(value);
  }

  handleCopyError(message: string): void {
    this.onCopyError.emit(message);
  }

  private getTemplate(name: string): TemplateRef<any> | undefined {
    return this.templates?.find(template => template.name === name)?.template;
  }
}
