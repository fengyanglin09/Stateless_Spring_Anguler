import { Component } from '@angular/core';
import {UntilDestroy, untilDestroyed} from '@ngneat/until-destroy';
import {
  AppAuthentication,
  AppDefaultAuthenticationService,
  AppNotificationService,
  AppRole, AppSession
} from 'mqml-angular-ui-layout-sdk/layout-interface';
import {finalize} from 'rxjs';
import {HttpErrorResponse} from '@angular/common/http';
import {isEqual, xorWith} from 'lodash-es';
import {Avatar} from 'primeng/avatar';
import {Skeleton} from 'primeng/skeleton';
import {TableModule} from 'primeng/table';
import {SelectButton} from 'primeng/selectbutton';
import {FormsModule} from '@angular/forms';
import {Checkbox} from 'primeng/checkbox';
import {Button} from 'primeng/button';
import {NgIf} from '@angular/common';
import {AppDialogComponent} from 'mqml-angular-ui-sdk/dialog';

@UntilDestroy()
@Component({
  selector: 'lib-app-user-info-dialog',
  imports: [
    Avatar,
    Skeleton,
    TableModule,
    SelectButton,
    FormsModule,
    Checkbox,
    Button,
    NgIf,
    AppDialogComponent
  ],
  templateUrl: './app.user-info-dialog.html',
  styleUrl: './app.user-info-dialog.scss',
  host: {
    class: 'cad-user-info-dialog',
  }
})
export class AppUserInfoDialog {
  allRoles: Array<AppRole> = [];
  allRolesState: boolean | null = null;
  currentUser: AppAuthentication | undefined | null;
  initialAllRolesState: boolean | null = null;
  visible: boolean = false;
  selectedRoles: AppRole[] = [];

  protected _hasChanges: boolean = false;
  protected _hasUnsavedChanges: boolean = false;
  protected loading: boolean = false;
  protected processing: boolean = false;

  private originalRoles: AppRole[] = [];
  private initialRoles: AppRole[] = [];

  constructor(private authenticationService: AppDefaultAuthenticationService,
              private notificationService: AppNotificationService) {
  }

  toggleAllRoles(): void {
    const toggleState = this.getAllState();
    this.selectedRoles = [];
    this.allRoles.forEach((item) => {
      if (!toggleState) {
        this.selectedRoles.push(item);
      }
    });
    this.allRolesState = this.getAllState();
    this.initState();
  }

  save(): void {
    // Prevent the disabled button from still firing.
    if (!this._hasUnsavedChanges)
      return;
    this.processing = true;
    this.authenticationService.updateUserRoles(this.selectedRoles)
      .pipe(
        untilDestroyed(this),
        finalize(() => this.processing = false)
      ).subscribe({
      next: (user: AppAuthentication) => {
        this.currentUser = user;
        this.hide();
      },
      error: (error: HttpErrorResponse) => {
        console.error('An unknown exception has occurred updating user.', error);
        this.notificationService.errorTemplate('Error updating user roles.', 'Update roles')
      }
    });
  }

  reset(): void {
    if (this.currentUser?.originalRoles) {
      this.selectedRoles = [...this.currentUser.originalRoles];
    }
    this.initState();
  }

  show(): void {
    this.loadUser();
    this.visible = true;
  }

  hide(): void {
    this.selectedRoles = this.initialRoles;
    this.allRolesState = this.initialAllRolesState;
    this.visible = false;
  }

  initState(): void {
    this.allRolesState = this.getAllState();
    this._hasChanges = this.hasChanges();
    this._hasUnsavedChanges = this.hasUnsavedChanges();
  }

  private loadUser(): void {
    this.loading = true;
    this.authenticationService.getSession()
      .pipe(
        untilDestroyed(this),
        finalize(() => this.loading = false)
      ).subscribe({
      next: (session: AppSession) => {
        if (session && session.isAuthenticated()) {
          this.currentUser = session.getAuthentication();
          if (this.currentUser) {

            if (this.currentUser.roles) {
              this.selectedRoles = [...this.currentUser.roles]
            }
            if (this.currentUser.originalRoles) {
              this.originalRoles = [...this.currentUser.originalRoles];
            }
            if (this.currentUser.roles) {
              this.initialRoles = [...this.currentUser.roles];
            }

            this.initUserRoles();
            this.initState();

          }
        }
      },
      error: (error: HttpErrorResponse) => {
        console.error('An unknown exception has occurred updating user.', error);
        this.notificationService.errorTemplate('Error loading user roles.', 'User')
      }
    });
  }

  private initUserRoles(): void {
    this.authenticationService.getAllRoles()
      .pipe(untilDestroyed(this))
      .subscribe({
        next: (roles: AppRole[]) => {
          this.allRoles = roles;
          this.allRolesState = this.getAllState();
          this.initialAllRolesState = this.allRolesState;
        }
      })
  }

  private getAllState(): boolean | null {
    const totalSelected = this.selectedRoles.length;
    if (totalSelected === this.allRoles.length)
      return true;
    else if (totalSelected > 0)
      return false;
    else
      return null;
  }

  private hasChanges(): boolean {
    return this.isDifferent(this.originalRoles, this.selectedRoles);
  }

  private hasUnsavedChanges(): boolean {
    return this.isDifferent(this.initialRoles, this.selectedRoles);
  }

  private isDifferent(rolesA: AppRole[], rolesB: AppRole[]): boolean {
    return xorWith(rolesA, rolesB, isEqual).length > 0
  }
}
