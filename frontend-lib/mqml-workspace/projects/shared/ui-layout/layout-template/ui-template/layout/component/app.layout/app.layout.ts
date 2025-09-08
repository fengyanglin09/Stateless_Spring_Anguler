import {Component, computed, OnDestroy, Renderer2, ViewChild} from '@angular/core';
import {filter, Subscription} from 'rxjs';
import {NavigationEnd, Router, RouterOutlet} from '@angular/router';
import {AppSidebar} from '../app.sidebar/app.sidebar';
// import {AppTopbar} from '../app.topbar/app.topbar';
import {LayoutService} from '../../service/layout.service';
import {AppConfigurationService, AppSessionMonitorService} from 'mqml-angular-ui-layout-sdk/layout-interface';
import {AppEnvironmentRibbonComponent} from 'mqml-angular-ui-sdk/environment-ribbon'
import {NgClass} from '@angular/common';
import {AppRightMenu} from '../app.rightmenu/app.rightmenu';
import {AppBreadcrumb} from '../app.breadcrumb/app.breadcrumb';
import {AppFooter} from '../app.footer/app.footer';
import {AppConfigurator} from '../app.configurator/app.configurator';
import {Toast} from 'primeng/toast';
@Component({
  selector: 'lib-app-layout',
  imports: [
    AppEnvironmentRibbonComponent,
    NgClass,
    // AppTopbar,
    AppRightMenu,
    AppSidebar,
    AppBreadcrumb,
    RouterOutlet,
    AppFooter,
    AppConfigurator,
    Toast
  ],
  templateUrl: './app.layout.html',
  styleUrls: ['./app.layout.scss']
})
export class AppLayout implements OnDestroy {
  overlayMenuOpenSubscription: Subscription;

  menuOutsideClickListener: any;

  menuScrollListener: any;

  @ViewChild(AppSidebar) appSidebar!: AppSidebar;

  // @ViewChild(AppTopbar) appTopbar!: AppTopbar;

  constructor(
    public layoutService: LayoutService,
    public renderer: Renderer2,
    public router: Router,
    public configurationService: AppConfigurationService,
    private cadSessionMonitorService: AppSessionMonitorService
  ) {
    this.overlayMenuOpenSubscription = this.layoutService.overlayOpen$.subscribe(() => {
      if (!this.menuOutsideClickListener) {
        this.menuOutsideClickListener = this.renderer.listen('document', 'click', (event) => {
          const isOutsideClicked = !(
            this.appSidebar.appMenu.el.nativeElement.isSameNode(event.target) ||
            this.appSidebar.appMenu.el.nativeElement.contains(event.target)
            // ||
            // this.appTopbar.menuButton.nativeElement.isSameNode(event.target) ||
            // this.appTopbar.menuButton.nativeElement.contains(event.target)
          );
          if (isOutsideClicked) {
            this.hideMenu();
          }
        });
      }

      if ((this.layoutService.isSlim() || this.layoutService.isSlimPlus()) && !this.menuScrollListener) {
        this.menuScrollListener = this.renderer.listen(this.appSidebar.appMenu.menuContainer.nativeElement, 'scroll', (event) => {
          if (this.layoutService.isDesktop()) {
            this.hideMenu();
          }
        });
      }

      if (this.layoutService.layoutState().staticMenuMobileActive) {
        this.blockBodyScroll();
      }
    });

    this.router.events.pipe(filter((event) => event instanceof NavigationEnd)).subscribe(() => {
      this.hideMenu();
    });


    if(configurationService.configuration.sessionMonitor.enabled){
      this.cadSessionMonitorService.start();
    }else {
      console.debug('Session monitor is disabled');
    }

  }

  blockBodyScroll(): void {
    if (document.body.classList) {
      document.body.classList.add('blocked-scroll');
    } else {
      document.body.className += ' blocked-scroll';
    }
  }

  unblockBodyScroll(): void {
    if (document.body.classList) {
      document.body.classList.remove('blocked-scroll');
    } else {
      document.body.className = document.body.className.replace(new RegExp('(^|\\b)' + 'blocked-scroll'.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
    }
  }

  hideMenu() {
    this.layoutService.layoutState.update((prev) => ({ ...prev, overlayMenuActive: false, staticMenuMobileActive: false, menuHoverActive: false }));
    this.layoutService.reset();
    if (this.menuOutsideClickListener) {
      this.menuOutsideClickListener();
      this.menuOutsideClickListener = null;
    }

    if (this.menuScrollListener) {
      this.menuScrollListener();
      this.menuScrollListener = null;
    }

    this.unblockBodyScroll();
  }

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

  ngOnDestroy() {
    if (this.overlayMenuOpenSubscription) {
      this.overlayMenuOpenSubscription.unsubscribe();
    }

    if (this.menuOutsideClickListener) {
      this.menuOutsideClickListener();
    }

    if(this.cadSessionMonitorService.active){
      this.cadSessionMonitorService.stop();
    }
  }
}
