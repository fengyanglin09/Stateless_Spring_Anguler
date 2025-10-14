import {Component, effect, inject, OnInit} from '@angular/core';
import {LayoutService} from '../../services/layout.service';
import {RouterLink} from '@angular/router';
import {AppConfiguration} from '../../models/app.configuration.model';
import {firstValueFrom, take} from 'rxjs';
import {NgClass} from '@angular/common';
import {AppTopbarSearch} from '../app.topbar-search/app.topbar-search';

@Component({
  selector: '[app-topbar]',
  imports: [
    RouterLink,
    NgClass,
    AppTopbarSearch
  ],
  templateUrl: './app.topbar.html',
  styleUrl: './app.topbar.scss',
  host: {
    class: 'layout-topbar'
  }
})
export class AppTopbar implements OnInit {

    layoutService = inject(LayoutService);

    appConfig?: AppConfiguration;

    isSideMenuOpen: boolean = false;

    constructor() {
      effect(() => {
        this.isSideMenuOpen = this.layoutService.getSideMenuMobileActiveStatus();
      });
    }


    async ngOnInit(): Promise<void> {
        this.appConfig = await firstValueFrom(this.layoutService.getConfiguration());
    }

    toggleSideMenu(): void {
      this.layoutService.setSideMenuMobileActive(!this.layoutService.getSideMenuMobileActiveStatus());
    }

    onMenuButtonClick() {
      this.isSideMenuOpen = !this.isSideMenuOpen;
      this.toggleSideMenu();
    }
}
