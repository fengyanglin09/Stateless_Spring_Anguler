import {Component, effect, ViewChild} from '@angular/core';
import {Drawer} from 'primeng/drawer';
import {Button} from 'primeng/button';
import {StyleClass} from 'primeng/styleclass';
import {Ripple} from 'primeng/ripple';
import {Avatar} from 'primeng/avatar';
import {LayoutService} from '../../services/layout.service';

@Component({
  selector: '[app-sidebar-menu]',
  imports: [
    Drawer,
    Button,
    StyleClass,
    Ripple,
    Avatar
  ],
  templateUrl: './app.sidebar-menu.html',
  styleUrl: './app.sidebar-menu.scss'
})
export class AppSidebarMenu {
  @ViewChild('drawerRef') drawerRef!: Drawer;

  closeCallback(e: Event): void {
    this.drawerRef.close(e);
  }

  visible: boolean = false;

  constructor(private layoutService: LayoutService) {
    effect(() => {
      this.visible = this.layoutService.getSideMenuMobileActiveStatus()
    });
  }
}
