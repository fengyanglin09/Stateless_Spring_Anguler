import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  Output,
  TemplateRef,
  ViewChild, ViewEncapsulation
} from '@angular/core';
import {AppClipboardService, AppSafeHtmlPipe, AppStyle} from 'mqml-angular-ui-sdk/api';
import {Popover} from 'primeng/popover';
import {NgClass, NgIf, NgStyle} from '@angular/common';
import {Tooltip} from 'primeng/tooltip';
import {Divider} from 'primeng/divider';
import {AppButtonComponent} from 'mqml-angular-ui-sdk/button';

@Component({
  selector: 'lib-app-content-overflow-ellipsis.component',
  imports: [
    NgStyle,
    Tooltip,
    NgClass,
    AppSafeHtmlPipe,
    Popover,
    NgIf,
    Divider,
    AppButtonComponent
  ],
  templateUrl: './app-content-overflow-ellipsis.component.html',
  styleUrl: './app-content-overflow-ellipsis.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class AppContentOverflowEllipsisComponent implements AfterViewInit, OnDestroy {
  /** Input(s) **/
  @Input() label: string | undefined;
  @Input() value: string | TemplateRef<any> | undefined;
  @Input() style: AppStyle;
  @Input() styleClass: string | undefined;
  @Input() copyEnabled: boolean = true;
  @Input() tooltip: string | undefined;
  @Input() tooltipEscape: boolean = true;
  @Input() tooltipStyleClass: string | undefined;

  @Output() onCopySuccess: EventEmitter<string> = new EventEmitter<string>()
  @Output() onCopyError: EventEmitter<string> = new EventEmitter<string>()

  /** ViewChild(s) **/
  @ViewChild('container') containerParentRef!: ElementRef; // Had to set as the parent. Resize was not firing on child.
  @ViewChild('overlayPanel') overlayPanel!: Popover;

  /** Variable(s) **/
  containerElement!: HTMLSpanElement;
  textOverflow: boolean = false;
  singleClick: boolean = true;
  resizeObserver!: ResizeObserver;
  defaultTooltip: string = 'Click to view value or double click to copy to clipboard.'

  constructor(private appClipboardService: AppClipboardService) {
  }


  ngAfterViewInit(): void {
    if (this.containerParentRef?.nativeElement) {
      const element = this.containerParentRef.nativeElement;
      this.resizeObserver = new ResizeObserver(() => {
        const contentElements = element.querySelectorAll("span");
        for(let contentElement of contentElements){
          if(contentElement.innerHTML.length){
            this.containerElement = contentElement;
            break;
          }
        }
        if(!this.containerElement){
          console.debug('Defaulting containerElement to first span element.');
          this.containerElement = contentElements[0];
        }
        this.visibleChange();
        this.resizeObserver.unobserve(element);
      });
      this.resizeObserver.observe(element);
    }
  }

  ngOnDestroy(): void {
    if (this.resizeObserver && this.containerParentRef?.nativeElement) {
      this.resizeObserver.unobserve(this.containerParentRef.nativeElement);
      this.resizeObserver.disconnect();
    }
  }

  visibleChange(): void {
    this.textOverflow = this.isTextOverflow();
  }

  handleClick(event: any): void {
    if (this.textOverflow) {
      this.singleClick = true;
      setTimeout(() => {
        if (this.singleClick) {
          this.overlayPanel.show(event, this.containerParentRef.nativeElement);
        }
      }, 250);
    }
  }

  handleDblClick(): void {
    this.singleClick = false;
    if (this.copyEnabled && this.textOverflow) {
      this.copyToClipboard();
    }
  }

  copyToClipboard(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.containerParentRef?.nativeElement) {
        this.appClipboardService.copyByElement(this.containerParentRef.nativeElement)
          .then((value: string) => {
            this.onCopySuccess.emit(value);
            resolve();
          })
          .catch((error: string) => {
            this.onCopyError.emit(error);
            reject()
          });
      } else {
        this.onCopyError.emit('Element not available');
        reject();
      }
    })


  }

  copyToClipboardAndClose(): void {
    this.copyToClipboard()
      .finally(() => this.overlayPanel.hide());
  }

  private isTextOverflow(): boolean {
    if (this.containerParentRef?.nativeElement && this.containerElement) {
      let fullWidth = this.containerElement.getBoundingClientRect().width;
      let displayWidth = this.containerParentRef.nativeElement.getBoundingClientRect().width;
      let fullHeight = this.containerElement.getBoundingClientRect().height;
      let displayHeight = this.containerParentRef.nativeElement.getBoundingClientRect().height;
      return fullWidth > displayWidth || fullHeight > displayHeight;
    }
    return false;
  }
}
