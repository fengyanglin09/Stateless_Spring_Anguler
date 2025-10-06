import {Component, computed, ViewChild} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {NgClass} from '@angular/common';
import {LayoutService} from '../../services/layout.service';
import {AppFooter} from '../../components/app.footer/app.footer';
import {AppTopbar} from '../../components/app.topbar/app.topbar';
import {AppSidebarMenu} from '../../components/app.sidebar-menu/app.sidebar-menu';

@Component({
  selector: 'app-layout',
  imports: [
    RouterOutlet,
    NgClass,
    AppFooter,
    AppTopbar,
    AppSidebarMenu
  ],
  templateUrl: './app.layout.html',
  styleUrl: './app.layout.scss'
})
export class AppLayout {

  @ViewChild(AppSidebarMenu, {static: true}) sidebarMenu!: AppSidebarMenu;

  constructor(
    public layoutService: LayoutService
  ) {}




  containerClass = computed(() => {
    const layoutConfig = this.layoutService.layoutConfig();
    const layoutState = this.layoutService.layoutState();

    return {
      'layout-overlay': layoutConfig.menuMode === 'overlay',
      'layout-static': layoutConfig.menuMode === 'static',
      'layout-slim': layoutConfig.menuMode === 'slim',
      'layout-slim-plus': layoutConfig.menuMode === 'slim-plus',
      'layout-horizontal': layoutConfig.menuMode === 'horizontal',
      'layout-reveal': layoutConfig.menuMode === 'reveal',
      'layout-drawer': layoutConfig.menuMode === 'drawer',
      'layout-sidebar-dark': layoutConfig.darkTheme,
      'layout-static-inactive': layoutState.staticMenuDesktopInactive && layoutConfig.menuMode === 'static',
      'layout-overlay-active': layoutState.overlayMenuActive,
      'layout-mobile-active': layoutState.staticMenuMobileActive,
      'layout-topbar-menu-active': layoutState.topbarMenuActive,
      'layout-menu-profile-active': layoutState.rightMenuActive,
      'layout-sidebar-active': layoutState.sidebarActive,
      'layout-sidebar-anchored': layoutState.anchored,
      [`layout-topbar-${layoutConfig.topbarTheme}`]: true,
      [`layout-menu-${layoutConfig.menuTheme}`]: true,
      [`layout-menu-profile-${layoutConfig.menuProfilePosition}`]: true
    };
  });

}
