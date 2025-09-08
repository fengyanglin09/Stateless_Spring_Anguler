import {Component, inject} from '@angular/core';
import {LayoutService} from '../../service/layout.service';
import {Drawer} from 'primeng/drawer';

@Component({
  selector: '[lib-app-right-menu]',
  imports: [
    Drawer
  ],
  templateUrl: './app.rightmenu.html',
  styleUrl: './app.rightmenu.scss'
})
export class AppRightMenu {
  layoutService = inject(LayoutService);

  get rightMenuActive(): boolean {
    return this.layoutService.layoutState().rightMenuActive;
  }

  set rightMenuActive(_val: boolean) {
    this.layoutService.layoutState.update((prev) => ({ ...prev, rightMenuActive: _val }));
  }
}
