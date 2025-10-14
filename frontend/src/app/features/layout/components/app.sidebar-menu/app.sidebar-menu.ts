import {Component, effect, OnInit} from '@angular/core';
import {Drawer} from 'primeng/drawer';
import {LayoutService} from '../../services/layout.service';
import {MenuItem, PrimeTemplate} from 'primeng/api';
import {Menu} from 'primeng/menu';
import {Badge} from 'primeng/badge';
import {Ripple} from 'primeng/ripple';

@Component({
  selector: '[app-sidebar-menu]',
  imports: [
    Drawer,
    Menu,
    Badge,
    Ripple,
    PrimeTemplate
  ],
  templateUrl: './app.sidebar-menu.html',
  styleUrl: './app.sidebar-menu.scss'
})
export class AppSidebarMenu implements OnInit {



  visible: boolean = false;

  items: MenuItem[] | undefined;

  constructor(private layoutService: LayoutService) {
    effect(() => {
      this.visible = this.layoutService.getSideMenuMobileActiveStatus()
    });
  }


  onCloseMenu() {

  }

  onShowMenu() {

  }

  onVisibleChange($event: boolean) {
    this.layoutService.setSideMenuMobileActive(this.visible);
  }

  ngOnInit() {
    this.items = [
      // {
      //   separator: true
      // },
      {
        label: 'Work Space',
        items: [
          {
            label: 'List Of Apps',
            icon: 'pi pi-th-large',
            // shortcut: '⌘+N',
            // command(event: MenuItemCommandEvent) {
            //   console.log('Menu item clicked');
            // },
            // routerLink:[]
          },
          {
            label: 'Search',
            icon: 'pi pi-search',
            // shortcut: '⌘+S'
          }
        ]
      },
      {
        label: 'Components',
        items: [
          {
            label: 'Settings',
            icon: 'pi pi-cog',
            // shortcut: '⌘+O'
          },
          {
            label: 'Messages',
            icon: 'pi pi-inbox',
            badge: '2'
          },
          {
            label: 'Logout',
            icon: 'pi pi-sign-out',
            // shortcut: '⌘+Q'
          }
        ]
      },
      // {
      //   separator: true
      // }
    ];
  }



}
