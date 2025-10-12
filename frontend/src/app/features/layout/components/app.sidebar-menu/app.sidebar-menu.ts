import {Component, effect, OnInit, ViewChild} from '@angular/core';
import {Drawer} from 'primeng/drawer';
import {LayoutService} from '../../services/layout.service';
import {MenuItem} from 'primeng/api';
import {Menu} from 'primeng/menu';
import {Avatar} from 'primeng/avatar';
import {Badge} from 'primeng/badge';
import {Ripple} from 'primeng/ripple';
import {NgIf} from '@angular/common';

@Component({
  selector: '[app-sidebar-menu]',
  imports: [
    Drawer,
    Menu,
    Avatar,
    Badge,
    Ripple,
    NgIf
  ],
  templateUrl: './app.sidebar-menu.html',
  styleUrl: './app.sidebar-menu.scss'
})
export class AppSidebarMenu implements OnInit {

  @ViewChild('drawerRef') drawerRef!: Drawer;

  closeCallback(e: Event): void {
    this.drawerRef.close(e);
  }

  visible: boolean = false;

  items: MenuItem[] | undefined;

  constructor(private layoutService: LayoutService) {
    effect(() => {
      this.visible = this.layoutService.getSideMenuMobileActiveStatus()
    });
  }


  onCloseMenu() {
    this.visible = !this.visible;
    this.layoutService.setSideMenuMobileActive(this.visible);
  }

  ngOnInit() {
    this.items = [
      {
        separator: true
      },
      {
        label: 'Documents',
        items: [
          {
            label: 'New',
            icon: 'pi pi-plus',
            shortcut: '⌘+N'
          },
          {
            label: 'Search',
            icon: 'pi pi-search',
            shortcut: '⌘+S'
          }
        ]
      },
      {
        label: 'Profile',
        items: [
          {
            label: 'Settings',
            icon: 'pi pi-cog',
            shortcut: '⌘+O'
          },
          {
            label: 'Messages',
            icon: 'pi pi-inbox',
            badge: '2'
          },
          {
            label: 'Logout',
            icon: 'pi pi-sign-out',
            shortcut: '⌘+Q'
          }
        ]
      },
      {
        separator: true
      }
    ];
  }
}
