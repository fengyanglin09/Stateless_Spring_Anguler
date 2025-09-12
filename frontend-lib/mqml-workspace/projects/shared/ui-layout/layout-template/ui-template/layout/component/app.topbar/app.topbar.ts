import {Component, ElementRef, inject, OnInit, ViewChild} from '@angular/core';
import {RouterLink} from '@angular/router';
import {AppUserInfoDialog} from '../app.user-info-dialog/app.user-info-dialog';
import {Ripple} from 'primeng/ripple';
import {NgClass, NgForOf, NgIf} from '@angular/common';
import {Avatar} from 'primeng/avatar';
import {Button, ButtonDirective} from 'primeng/button';
import {StyleClass} from 'primeng/styleclass';
import {FormsModule} from '@angular/forms';
import {AppTopbarMenuButton} from '../app.topbar-menu-button/app.topbar-menu-button';
import {MegaMenu} from 'primeng/megamenu';
import {SplitButton} from 'primeng/splitbutton';
import {LayoutService} from '../../service/layout.service';
import {MegaMenuItem, MenuItem, MenuItemCommandEvent} from 'primeng/api';
import {
  AppConfigurationService,
  AppDefaultAuthenticationService,
  AppMenuButton, AppMenuService,
  AppSearchMenu,
  AppSearchMenuItem,
  AppSession
} from 'mqml-angular-ui-layout-sdk/layout-interface';
import {UntilDestroy, untilDestroyed} from '@ngneat/until-destroy';
import {HttpErrorResponse} from '@angular/common/http';
import {InputGroup} from 'primeng/inputgroup';


@UntilDestroy()
@Component({
  selector: '[lib-app-topbar]',
  imports: [
    RouterLink,
    AppUserInfoDialog,
    Ripple,
    NgClass,
    Avatar,
    NgIf,
    ButtonDirective,
    StyleClass,
    NgForOf,
    Button,
    FormsModule,
    AppTopbarMenuButton,
    MegaMenu,
    SplitButton,
    InputGroup
  ],
  templateUrl: './app.topbar.html',
  styleUrl: './app.topbar.scss',
  host: {
    class: 'layout-topbar'
  }
})
export class AppTopbar implements OnInit {

  layoutService = inject(LayoutService);

  @ViewChild('searchInput') searchInput!: ElementRef<HTMLInputElement>;

  @ViewChild('menuButton') menuButton!: ElementRef<HTMLButtonElement>;

  @ViewChild('mobileMenuButton') mobileMenuButton!: ElementRef<HTMLButtonElement>;

  model: MegaMenuItem[] = [];
  session?: AppSession;
  searchOptions: MenuItem[] = [];
  searchSelected?: AppSearchMenuItem;
  searchMenu?: AppSearchMenu;
  searchTerm: string = '';
  topBarMenuButtons: AppMenuButton[] = [];
  userMenuItems: MenuItem[] = [];

  constructor(
    private authenticationService: AppDefaultAuthenticationService,
    public configurationService: AppConfigurationService,
    private cadMenuService: AppMenuService) {
  }


  onMenuButtonClick() {
    this.layoutService.onMenuToggle();
  }

  onRightMenuButtonClick() {
    this.layoutService.openRightMenu();
  }

  toggleConfigSidebar() {
    let layoutState = this.layoutService.layoutState();

    if (this.layoutService.isSidebarActive()) {
      layoutState.overlayMenuActive = false;
      layoutState.overlaySubmenuActive = false;
      layoutState.staticMenuMobileActive = false;
      layoutState.menuHoverActive = false;
      layoutState.configSidebarVisible = false;
    }
    layoutState.configSidebarVisible = !layoutState.configSidebarVisible;
    this.layoutService.layoutState.set({...layoutState});
  }

  focusSearchInput() {
    setTimeout(() => {
      this.searchInput.nativeElement.focus();
    }, 150);
  }

  onTopbarMenuToggle() {
    this.layoutService.layoutState.update((val) => ({...val, topbarMenuActive: !val.topbarMenuActive}));
  }

  ngOnInit(): void {
    this.authenticationService.getSessionListener()
      .pipe(untilDestroyed(this))
      .subscribe({
        next: (session: AppSession) => {
          this.session = session;
          this.initializeMenu();
        }
      });
  }

  initializeMenu(): void {
    this.cadMenuService.getSearchMenu(this.session?.authentication || null)
      .pipe(untilDestroyed(this))
      .subscribe({
        next: (menu: AppSearchMenu | void) => {
          if(menu) {
            this.searchMenu = menu;
            this.searchOptions = menu.menuItems.map((searchMenuItem: AppSearchMenuItem) => {
              return {
                id: searchMenuItem.id,
                label: searchMenuItem.label,
                icon: searchMenuItem.icon,
                command: (event: MenuItemCommandEvent) => this.onSearchSelected(searchMenuItem)
              }
            })
            if (this.searchMenu?.menuItems?.[menu.selectedIndex]) {
              this.searchSelected = this.searchMenu.menuItems[menu.selectedIndex];
            }
          }else {
            this.searchMenu = undefined;
            this.searchOptions = [];
            this.searchSelected = undefined;
          }
        },
        error: (error: HttpErrorResponse) => {
          console.error('Unknown error retrieving search menu items.', error);
        }
      });
    this.cadMenuService.getTopBarMenuButtons(this.session?.authentication || null)
      .pipe(untilDestroyed(this))
      .subscribe({
        next: (menuItems: AppMenuButton[]) => {
          this.topBarMenuButtons = menuItems;
        },
        error: (error: HttpErrorResponse) => {
          console.error('Unknown error retrieving top bar button menu configuration.', error);
        }
      });
    this.cadMenuService.getUserMenuItems(this.session?.authentication || null)
      .pipe(untilDestroyed(this))
      .subscribe({
        next: (menuItems: MenuItem[]) => {
          this.userMenuItems = menuItems;
        },
        error: (error: HttpErrorResponse) => {
          console.error('Unknown error retrieving user menu configuration.', error);
        }
      });
  }

  onSearchSelected(item: AppSearchMenuItem): void {
    this.searchSelected = item;
  }

  onSearch() {
    if (this.searchTerm?.length && this.searchSelected) {
      this.searchMenu?.onSearch(this.searchTerm, this.searchSelected)
        .pipe(untilDestroyed(this))
        .subscribe({
          next: () => {
            this.searchTerm = '';
          },
          error: (err: HttpErrorResponse) => {
            console.error('An unknown error occurred during search.', err);
          }
        })
    }
  }

  onTopBarItemClicked(event: any, item: AppMenuButton) {
    event.stopPropagation();
    if (typeof item.click === 'function') {
      item.click(event);
    }
  }

  logout(): void {
    this.authenticationService.logout();
  }


}
