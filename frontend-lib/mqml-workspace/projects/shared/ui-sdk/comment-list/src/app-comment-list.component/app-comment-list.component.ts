import {Component, ElementRef, Input, OnChanges, SimpleChanges, ViewChild} from '@angular/core';
import {MenuItem} from 'primeng/api';
import {AppComment, AppSafeHtmlPipe, AppStyle, AppTagSeverity} from 'mqml-angular-ui-sdk/api';
import {Menu} from 'primeng/menu';
import {DatePipe, NgClass, NgForOf, NgIf} from '@angular/common';
import {Skeleton} from 'primeng/skeleton';
import {TableModule} from 'primeng/table';
import {Avatar} from 'primeng/avatar';
import {Button} from 'primeng/button';
import {AppTagComponent} from 'mqml-angular-ui-sdk/tag';
import {ScrollTop} from 'primeng/scrolltop';

@Component({
  selector: 'lib-app-comment-list',
  imports: [
    NgClass,
    NgIf,
    Skeleton,
    NgForOf,
    TableModule,
    Avatar,
    AppSafeHtmlPipe,
    Button,
    DatePipe,
    AppTagComponent,
    ScrollTop,
    Menu
  ],
  templateUrl: './app-comment-list.component.html',
  standalone: true,
  styleUrl: './app-comment-list.component.scss'
})
export class AppCommentListComponent implements OnChanges {
  @Input() deletedTagLabel: string = 'Deleted';
  @Input() deletedTagSeverity: AppTagSeverity = 'danger';
  @Input() draftTagLabel: string = 'Drafted';
  @Input() draftTagSeverity: AppTagSeverity = 'warn';
  @Input() emptyMessage: string = 'No comments'
  @Input() loading: boolean = false;
  @Input() menuIcon: string = 'fa-solid fa-ellipsis'
  @Input() menuProvider?: (comment: AppComment, index: number) => MenuItem[];
  @Input() processing: boolean = false;
  @Input() readOnly: boolean = false;
  @Input() scrollTopEnabled: boolean = true;
  @Input() scrollTopThreshold: number = 500;
  @Input() skeletonEntries: number = 3;
  @Input() style: AppStyle;
  @Input() styleClass: string | undefined;
  @Input() value: AppComment[] | undefined;

  @ViewChild("commentMenu") protected commentMenuComponent!: Menu;
  @ViewChild("commentList") protected commentListElement!: ElementRef;

  protected _value: AppComment[] = [];
  protected commentMenuItems: MenuItem[] = [];

  constructor() {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['value']) {
      this._value = this.value || [];
    }
  }

  scrollTop(): void {
    if (this.scrollTopEnabled && this.commentListElement?.nativeElement) {
      this.commentListElement.nativeElement.scrollTop = 0;
    }
  }

  setItemProcessing(index: number, processing: boolean) {
    if (this.value && index in this.value) {
      const comment: AppComment = this.value[index] ?? ({} as AppComment);

      comment._appInternal = {};

      comment._appInternal['processing'] = processing;
    }
  }

  protected toggleMenu(event: MouseEvent, comment: AppComment, index: number): void {
    if (typeof this.menuProvider === 'function') {
      this.commentMenuItems = this.menuProvider(comment, index);
      this.commentMenuComponent.toggle(event);
    }
  }

}
