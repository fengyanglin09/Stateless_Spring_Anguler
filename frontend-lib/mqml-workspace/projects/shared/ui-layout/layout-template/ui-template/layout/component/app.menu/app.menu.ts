import {Component, ElementRef, inject, ViewChild} from '@angular/core';
import {UntilDestroy, untilDestroyed} from '@ngneat/until-destroy';
import {AppDefaultAuthenticationService, AppMenuService, AppSession} from 'mqml-angular-ui-layout-sdk/layout-interface';
import {MenuItem} from 'primeng/api';
import {HttpErrorResponse} from '@angular/common/http';
import {NgForOf, NgIf} from '@angular/common';
import {AppMenuitem} from '../app.menuitem/app.menuitem';


@UntilDestroy()
@Component({
  selector: 'lib-app-menu',
  imports: [
    NgForOf,
    NgIf,
    AppMenuitem
  ],
  templateUrl: './app.menu.html',
  styleUrl: './app.menu.scss'
})
export class AppMenu {
  el: ElementRef = inject(ElementRef);

  @ViewChild('menuContainer') menuContainer!: ElementRef;

  model: any[] = [];

  constructor(private cadAuthenticationService: AppDefaultAuthenticationService,
              private cadMenuService: AppMenuService) {
    this.cadAuthenticationService.getSessionListener()
      .pipe(untilDestroyed(this))
      .subscribe({
        next: (cadSession: AppSession) => {
          this.initializeMenu(cadSession);
        }
      });
  }

  private initializeMenu(currentSession: AppSession): void {
    this.model = [];
    this.cadMenuService.getMainMenuItems(currentSession.authentication)
      .pipe(untilDestroyed(this))
      .subscribe({
        next: (menuItems: MenuItem[]) => {
          this.model = menuItems;
        },
        error: (error: HttpErrorResponse) => {
          console.error('Unknown error retrieving menu items.', error);
        }
      })
  }
}
