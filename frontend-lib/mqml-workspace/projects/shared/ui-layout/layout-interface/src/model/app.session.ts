import {AppAuthentication, AppRole} from './app.authentication';


export class AppSession {
  constructor(public authentication: AppAuthentication | null) {
  }

  getAuthentication(): AppAuthentication | null {
    return this.authentication;
  }

  isAuthenticated(): boolean {
    return !!this.authentication;
  }

  isExpired(): boolean {
    //TODO: Must determine when session should be expired
    return false;
  }

  isSupportUser(): boolean {
    return this.authentication?.supportUser || false;
  }

  hasRole(roleName: string): boolean {
    return this.authentication !== null && this.roleExists(roleName, this.authentication.roles);
  }

  hasAnyRole(roleNames: string[]): boolean {
    return roleNames.some((roleName) => {
      return this.hasRole(roleName);
    });
  }

  private roleExists(roleName: string, roles?: AppRole[]): boolean {
    if (roles === undefined) {
      return false;
    }
    return roles.some((role) => {
      return role.name === roleName;
    });
  }
}
