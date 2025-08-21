import {Component, EventEmitter, Input, OnChanges, Output, SimpleChanges} from '@angular/core';
import {NgIf, NgTemplateOutlet} from '@angular/common';
import {OverlayBadge} from 'primeng/overlaybadge';
import {Button} from 'primeng/button';
import {AppButtonIconPosition, AppButtonSeverity} from '../model/app-button.interface';


@Component({
  selector: 'lib-app-button',
  imports: [
    NgIf,
    OverlayBadge,
    NgTemplateOutlet,
    Button
  ],
  templateUrl: './app-button.component.html',
  styleUrl: './app-button.component.scss'
})
export class AppButtonComponent implements OnChanges {

  @Input() disabled: boolean = false;
  @Input() icon: string | undefined;
  @Input() iconPos: AppButtonIconPosition = 'left';
  @Input() label: string | undefined;
  @Input() link: boolean = false;
  @Input() loading: boolean = false;
  @Input() loadingIcon: string | undefined;
  @Input() outlined: boolean = false;
  @Input() raised: boolean = false;
  @Input() rounded: boolean = false;
  @Input() severity: AppButtonSeverity = 'primary';
  @Input() size: 'small' | 'large' | undefined;
  @Input() style: { [clazz: string]: any; } | null | undefined;
  @Input() styleClass: string | undefined;
  @Input() text: boolean = false;
  @Input() badgeOverlay: boolean = false
  @Input() badgeValue: string | undefined;
  @Input() badgeSeverity: 'secondary' | 'info' | 'success' | 'warn' | 'danger' | 'contrast' | null | undefined;
  @Input() ripple: boolean = true;

  @Output() click: EventEmitter<MouseEvent> = new EventEmitter();
  @Output() focus: EventEmitter<FocusEvent> = new EventEmitter<FocusEvent>();
  @Output() blur: EventEmitter<FocusEvent> = new EventEmitter<FocusEvent>();

  protected badgeClass: 'secondary' | 'info' | 'success' | 'warn' | 'danger' | 'contrast' | null | undefined;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['badgeOverlay'] && !this.badgeSeverity) {
      this.badgeSeverity = 'danger';
    }
    if (changes['badgeSeverity'] || changes['badgeOverlay']) {
      this.badgeClass = this.badgeSeverity;
    }
  }

}
