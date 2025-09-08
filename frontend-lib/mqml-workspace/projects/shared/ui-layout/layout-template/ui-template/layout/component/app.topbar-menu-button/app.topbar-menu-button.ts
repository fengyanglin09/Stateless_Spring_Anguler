import {Component, EventEmitter, Input, Output, ViewChild} from '@angular/core';
import {MenuItem} from 'primeng/api';
import {Menu} from 'primeng/menu';
import {AppStyle} from "mqml-angular-ui-sdk/api";
import {OverlayBadge} from 'primeng/overlaybadge';
import {NgClass, NgIf, NgStyle} from '@angular/common';
import {Tooltip} from 'primeng/tooltip';

@Component({
  selector: 'lib-app-topbar-menu-button',
  imports: [
    OverlayBadge,
    NgIf,
    NgClass,
    NgStyle,
    Tooltip,
    Menu
  ],
  templateUrl: './app.topbar-menu-button.html',
  styleUrl: './app.topbar-menu-button.scss'
})
export class AppTopbarMenuButton {
  @Input({required: true}) icon!: string;
  @Input() iconClass: string | undefined;
  @Input() iconStyle: AppStyle;
  @Input() items: MenuItem[] | undefined;
  @Input() tooltip: string | undefined;
  @Input() tooltipAppendTo: string | undefined;
  @Input() tooltipStyleClass: string | undefined;
  @Input() tooltipPosition: string | undefined;
  @Input() tooltipZIndex: string | undefined;
  @Input() badgeOverlay: boolean | undefined = false;
  @Input() badgeValue: string | number | undefined;
  @Input() badgeSeverity: 'info' | 'success' | 'warn' | 'danger' | undefined;
  @Input() badgeStyle: { [klass: string]: any } | null | undefined = null;
  @Input() badgeSize: 'small' | 'large' | 'xlarge' | undefined = undefined;

  @Output() click: EventEmitter<any> = new EventEmitter<any>();

  @ViewChild("menu") menu!: Menu;


  constructor() {
  }

  onItemClick(event: MouseEvent) {
    event.preventDefault();
    if (this.items?.length) {
      this.menu.toggle(event);
    }
    this.click.emit(event);
  }

  showBadge(): boolean {
    if (!this.badgeOverlay) return false;

    const value = this.badgeValue;
    if (typeof value === 'number') {
      return value > 0;
    }

    return false;
  }
}
