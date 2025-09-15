import {delay, Observable, of} from "rxjs";
import {Injectable} from "@angular/core";
import {Router} from "@angular/router";
import {AppAuthentication, AppRole} from 'mqml-angular-ui-layout-sdk/layout-interface';

@Injectable()
export class AppAuthenticationProvider implements AppAuthenticationProvider {

    roles: AppRole[] = this._getAllRoles();

    constructor(private router: Router) {}

    getAuthentication(): Observable<AppAuthentication | null> {
        return of(this._getAuthentication())
    }

    getAllRoles(): Observable<AppRole[]> {
        return of(this._getAllRoles());
    }

    updateUserRoles(roles: AppRole[]): Observable<AppAuthentication> {
        this.roles = roles;
        return of(this._getAuthentication()).pipe(delay(200000));
    }

    logout(): void {
        //TODO: Implement this method
    }

    login(): void {
        this.router.navigate(['/']);
    }

    private _getAllRoles(): AppRole[] {
        return [
            {
                name: 'Create',
                description: 'Allow users to add new content or resources',
                displayName: 'Create'
            },
            {
                name: 'Read',
                description: 'Allows users to view existing content without making changes',
                displayName: 'Read'
            },
            {
                name: 'Update',
                description: 'Allows users to edit and make changes to existing content',
                displayName: 'Update'
            },
            {
                name: 'Delete',
                description: 'Allows users to remove content from the system',
                displayName: 'Delete'
            },
            {
                name: 'Admin',
                description: 'Administrator',
                displayName: 'Admin'
            }
        ];
    }

    private _getAuthentication(): AppAuthentication {
        return {
            firstName: 'John',
            lastName: 'Doe',
            fullName: 'John Doe',
            lanId: '0001',
            emailAddress: 'doe.john@mayo.edu',
            department: 'Lost and found',
            jobTitle: 'Receptionist',
            roles: this.roles,
            originalRoles: this._getAllRoles(),
            photoUrl: 'assets/images/jane-doe.jpg',
            supportUser: true
        };
    }


}
