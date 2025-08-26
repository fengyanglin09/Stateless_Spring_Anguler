import {
  AfterViewInit,
  Component, ContentChildren,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  Output, QueryList, SimpleChanges,
  TemplateRef,
  ViewChild
} from '@angular/core';
import {AppBadgeSeverity, AppStyle} from 'mqml-angular-ui-sdk/api';
import {AppButtonSeverity} from 'mqml-angular-ui-sdk/button';
import {PrimeTemplate} from 'primeng/api';
import {Dialog} from 'primeng/dialog';
import {Badge} from 'primeng/badge';
import {NgClass, NgIf, NgTemplateOutlet} from '@angular/common';
import {Button} from 'primeng/button';
import {Divider} from 'primeng/divider';
import {ProgressBar} from 'primeng/progressbar';

@Component({
  selector: 'lib-app-dialog',
  imports: [
    Dialog,
    Badge,
    PrimeTemplate,
    NgClass,
    NgTemplateOutlet,
    NgIf,
    Button,
    Divider,
    ProgressBar
  ],
  templateUrl: './app-dialog.component.html',
  standalone: true,
  styleUrl: './app-dialog.component.scss'
})
export class AppDialogComponent implements OnChanges, AfterViewInit {

  @Input() appendTo: HTMLElement | ElementRef | TemplateRef<any> | string | null | undefined | any;
  @Input() closeable: boolean = false;
  @Input() closeIcon: string = 'fa-solid fa-xmark';
  @Input() closeOnEscape: boolean = false;
  @Input() dismissableMask: boolean = false;
  @Input() focusOnShow: boolean = true;
  @Input() footerClose: boolean = true;
  @Input() footerCloseLabel: string = 'Close';
  @Input() footerCloseSeverity: AppButtonSeverity = 'secondary';
  @Input() draggable: boolean = true;
  @Input() headerClose: boolean = false;
  @Input() headerCloseIcon: string = 'fa-solid fa-xmark';
  @Input() loading: boolean = false;
  @Input() modal: boolean = true;
  @Input() position: 'center' | 'top' | 'bottom' | 'left' | 'right' | 'topleft' | 'topright' | 'bottomleft' | 'bottomright' = 'center';
  @Input() processing: boolean = false;
  @Input() readOnly: boolean = true;
  @Input() resizable: boolean = true;
  @Input() showHeader: boolean = true;
  @Input() style: AppStyle;
  @Input() styleClass: string | undefined;
  @Input() title: string | undefined;
  @Input() titleBadge: string | undefined;
  @Input() titleBadgeSeverity: AppBadgeSeverity = 'info';
  @Input() maximizable: boolean = false;
  @Input() visible: boolean = false;

  @Output() visibleChange: EventEmitter<boolean> = new EventEmitter<boolean>()

  /**
   * Expose the p-dialog component for interaction with
   * the typescript code.
   */
  @ViewChild('dialog', {static: true}) dialog: Dialog | undefined;
  @ContentChildren(PrimeTemplate) templates: QueryList<PrimeTemplate> | undefined;

  headerTemplate: TemplateRef<any> | undefined;
  contentTemplate: TemplateRef<any> | undefined;
  footerTemplate: TemplateRef<any> | undefined;

  _originalWidth: string | undefined;
  _originalHeight: string | undefined;
  _originalMaxWidth: string | undefined;
  _originalMaxHeight: string | undefined;
  _originalPosition = this.position;
  _styleClass: string = "cad-dialog";

  constructor() {
  }


  ngOnChanges(changes: SimpleChanges): void {
    if (changes['styleClass']) {
      this._styleClass = this.getStyleClass();
    }
    if (changes['position']) {
      this._originalPosition = this.position;
    }
  }


  ngAfterViewInit(): void {
    this.headerTemplate = this.getTemplate('header');
    this.contentTemplate = this.getTemplate('content');
    this.footerTemplate = this.getTemplate('footer');
    if(this.dialog){
      if(this.closeOnEscape) {
        this.dialog.bindDocumentEscapeListener();
      }else {
        this.dialog.unbindDocumentEscapeListener();
      }
    }
  }

  hide(): void {
    this.position = this._originalPosition;
    this.visible = false;
    this.visibleChange.emit(this.visible);
  };

  show(): void {
    this.visible = true;
    this.visibleChange.emit(this.visible);
  };

  toggleVisible(): void {
    if (this.visible) {
      this.hide();
    } else {
      this.show();
    }
  };


  toggleMaximize(): void {
    if (this.dialog) {
      if (!this.dialog.maximized) {
        //Unset maxWidth and maxHeight styles
        this._originalWidth = this.dialog.style.width;
        this._originalHeight = this.dialog.style.height;
        this._originalMaxWidth = this.dialog.style.maxWidth;
        this._originalMaxHeight = this.dialog.style.maxHeight;
        this.dialog.style.width = 'auto';
        this.dialog.style.height = 'auto';
        this.dialog.style.maxWidth = 'auto';
        this.dialog.style.maxHeight = 'auto';
      } else {
        this.dialog.style.width = this._originalWidth;
        this.dialog.style.height = this._originalHeight;
        this.dialog.style.maxWidth = this._originalMaxWidth;
        this.dialog.style.maxHeight = this._originalMaxHeight;
      }
      this.dialog.maximize();
    }
  }

  private getTemplate(name: string): TemplateRef<any> | undefined {
    return this.templates?.find(template => template.name === name)?.template;
  }

  private getStyleClass(): string {
    let styleClass: string = 'cad-dialog';
    if (this.styleClass) {
      styleClass += ` ${this.styleClass}`;
    }
    return styleClass;
  }

}
