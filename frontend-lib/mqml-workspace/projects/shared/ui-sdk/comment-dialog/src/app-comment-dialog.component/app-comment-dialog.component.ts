import {Component, ElementRef, EventEmitter, Input, OnChanges, Output, SimpleChanges, ViewChild} from '@angular/core';
import {MenuItem, PrimeTemplate} from 'primeng/api';
import {AppBadgeSeverity, AppComment, AppStyle, AppTagSeverity} from '../../../api';
import {Menu} from 'primeng/menu';
import {AppButtonSeverity} from '../../../button';
import {ControlValueAccessor} from '@angular/forms';
import {
  AppCommentDialogDeleteEvent,
  AppCommentDialogInputModel,
  AppCommentDialogSaveEvent
} from '../model/app-comment-dialog.interface';
import {AppDialogComponent} from '../../../dialog';
import {Button} from 'primeng/button';
import {AppCommentListComponent} from '../../../comment-list';
import {NgIf} from '@angular/common';

@Component({
  selector: 'lib-app-comment-dialog',
  imports: [
    AppDialogComponent,
    Menu,
    Button,
    AppCommentListComponent,
    NgIf,
    PrimeTemplate
  ],
  templateUrl: './app-comment-dialog.component.html',
  styleUrl: './app-comment-dialog.component.scss'
})
export class AppCommentDialogComponent implements OnChanges, ControlValueAccessor  {
  @Input() closeable: boolean = false;
  @Input() closeButtonLabel: string = 'Close';
  @Input() closeButtonIcon: string | undefined = 'fa-solid fa-xmark';
  @Input() closeButtonSeverity: AppButtonSeverity = 'secondary';
  @Input() closeOnEscape: boolean = false;
  @Input() deletedTagLabel: string = 'Deleted';
  @Input() deletedTagSeverity: AppTagSeverity = 'danger';
  @Input() discardDraftButtonLabel: string = 'Discard Draft';
  @Input() discardDraftButtonIcon: string | undefined;
  @Input() discardDraftButtonSeverity: AppButtonSeverity = 'primary';
  @Input() draftButtonLabel: string = 'Save as Draft';
  @Input() draftButtonIcon: string | undefined;
  @Input() draftButtonSeverity: AppButtonSeverity = 'primary';
  @Input() draftEnabled: boolean = false;
  @Input() draftTagLabel: string = 'Drafted';
  @Input() draftTagSeverity: AppTagSeverity = 'warn';
  @Input() emptyMessage: string = 'No comments'
  @Input() focusOnShow: boolean = true;
  @Input() inputPlaceholder: string = 'Add comment';
  @Input() loading: boolean = false;
  @Input() maximizable: boolean = true;
  @Input() menuIcon: string = 'fa-solid fa-ellipsis'
  @Input() modal: boolean = false;
  @Input() processing: boolean = false;
  @Input() publishButtonLabel: string = 'Publish';
  @Input() publishButtonIcon: string | undefined;
  @Input() publishButtonSeverity: AppButtonSeverity = 'primary';
  @Input() readOnly: boolean = false;
  @Input() saveButtonLabel: string = 'Add Comment';
  @Input() saveButtonIcon: string | undefined;
  @Input() saveButtonSeverity: AppButtonSeverity = 'primary';
  @Input() scrollTopEnabled: boolean = true;
  @Input() scrollTopThreshold: number = 500;
  @Input() skeletonEntries: number = 3;
  @Input() style: AppStyle;
  @Input() styleClass: string | undefined;
  @Input() title: string | undefined = 'Comments';
  @Input() titleBadge: string | undefined;
  @Input() titleBadgeSeverity: AppBadgeSeverity = 'info';
  @Input() value: AppComment[] | undefined;
  @Input() visible: boolean = false;
  @Output() visibleChange: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() onCommentSave: EventEmitter<AppCommentDialogSaveEvent> = new EventEmitter<AppCommentDialogSaveEvent>();
  @Output() onCommentDelete: EventEmitter<AppCommentDialogDeleteEvent> = new EventEmitter<AppCommentDialogDeleteEvent>();
  @ViewChild("dialog") protected dialogComponent!: AppDialogComponent;
  @ViewChild("commentMenu") protected commentMenuComponent!: Menu;
  @ViewChild("commentList") protected commentListElement!: ElementRef;
  protected _value: AppComment[] = [];
  protected inputModel: AppCommentDialogInputModel = this.createNewModel();
  protected _titleBadge: string | undefined;
  protected commentMenuItems: MenuItem[] = [];

  constructor() {
  }

  @Input() menuProvider?: (comment: AppComment, index: number) => MenuItem[] = () => [];

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['value']) {
      this._value = this.value || [];
      this.initializeTitleBadge();
    }
    if (changes['titleBadge']) {
      this.initializeTitleBadge();
    }
  }

  show(): void {
    this.visible = true;
    this.visibleChange.emit(this.visible);
  }

  hide(): void {
    this.visible = false;
    this.visibleChange.emit(this.visible);
    this.clearInput();
  }

  toggleVisible(): void {
    if (this.visible) {
      this.hide();
    } else {
      this.show();
    }
  }

  scrollTop(): void {
    if (this.scrollTopEnabled && this.commentListElement?.nativeElement) {
      this.commentListElement.nativeElement.scrollTop = 0;
    }
  }

  setItemProcessing(index: number, processing: boolean) {
    if (this.value && index in this.value) {
      const comment = this.value[index];
      comment.loading = processing;
    }
  }

  clearInput(): void {
    this.inputModel = {
      published: false
    };
    this.onChanged(this.inputModel);
  }

  registerOnChange(fn: any): void {
    this.onChanged = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
  }

  writeValue(obj: any): void {
    this.inputModel = obj || this.createNewModel();
  }

  protected save(published: boolean = true): void {
    if (this.inputModel.value?.length) {
      this.inputModel.published = published;
      this.onCommentSave.emit({
        id: this.inputModel.id,
        value: this.inputModel.value,
        published: this.inputModel.published
      });
    }
  }

  protected delete(): void {
    if (this.inputModel.id) {
      this.onCommentDelete.emit({
        id: this.inputModel.id
      })
    }
  }

  protected toggleMenu(event: MouseEvent, comment: AppComment, index: number): void {
    if (typeof this.menuProvider === 'function') {
      this.commentMenuItems = this.menuProvider(comment, index);
      this.commentMenuComponent.toggle(event);
    }
  }

  private initializeTitleBadge(): void {
    this._titleBadge = undefined;
    if (this.titleBadge) {
      this._titleBadge = this.titleBadge;
    } else if (this.value) {
      this._titleBadge = `${this.value.length}`;
    }
  }

  private createNewModel(): AppCommentDialogInputModel {
    return {
      published: !this.draftEnabled
    }
  }

  private onChanged = (value: AppCommentDialogInputModel) => {
  };

  private onTouched = () => {
  };
}
