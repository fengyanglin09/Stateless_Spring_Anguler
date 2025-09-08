import {Component, computed, ElementRef, inject, OnDestroy, ViewChild} from '@angular/core';
import {NgIf} from '@angular/common';
import {AppMenuProfile} from '../app.menuprofile/app.menuprofile';
import {LayoutService} from '../../service/layout.service';
import {AppMenu} from '../app.menu/app.menu';

@Component({
  selector: '[lib-app-sidebar]',
  imports: [
    NgIf,
    AppMenuProfile
  ],
  templateUrl: './app.sidebar.html',
  styleUrl: './app.sidebar.scss'
})
export class AppSidebar implements OnDestroy {
  el = inject(ElementRef);

  layoutService = inject(LayoutService);

  @ViewChild(AppMenu) appMenu!: AppMenu;

  @ViewChild('menuProfileStart') menuProfileStart!: AppMenuProfile;

  @ViewChild('menuProfileEnd') menuProfileEnd!: AppMenuProfile;

  @ViewChild('menuContainer') menuContainer!: ElementRef;

  overlayMenuActive = computed(() => this.layoutService.layoutState().overlayMenuActive);

  menuProfilePosition = computed(() => this.layoutService.layoutConfig().menuProfilePosition);

  anchored = computed(() => this.layoutService.layoutState().anchored);

  timeout: any;

  resetOverlay() {
    if (this.overlayMenuActive()) {
      this.layoutService.layoutState.update((val) => ({ ...val, overlayMenuActive: false }));
    }
  }

  onMouseEnter() {
    if (!this.anchored()) {
      if (this.timeout) {
        clearTimeout(this.timeout);
        this.timeout = null;
      }
      this.layoutService.layoutState.update((val) => ({ ...val, sidebarActive: true }));
    }
  }

  onMouseLeave() {
    if (!this.anchored()) {
      if (!this.timeout) {
        this.timeout = setTimeout(() => this.layoutService.layoutState.update((val) => ({ ...val, sidebarActive: false })), 300);
      }
    }
  }

  anchor() {
    this.layoutService.layoutState.update((val) => ({ ...val, anchored: !val.anchored }));
  }

  ngOnDestroy() {
    this.resetOverlay();
  }
}
