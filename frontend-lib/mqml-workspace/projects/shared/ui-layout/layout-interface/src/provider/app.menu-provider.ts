import {Observable} from "rxjs";
import {MenuItem} from "primeng/api";
import {AppAuthentication} from '../model/app.authentication';
import {AppSearchMenu} from '../model/app.search-menu';
import {AppMenuButton} from '../model/app.menu-button';


export interface AppMenuProvider {

    getMainMenuItems(authentication:AppAuthentication | null): Observable<MenuItem[]>

    getSearchMenu(authentication:AppAuthentication | null): Observable<AppSearchMenu | void>

    getTopBarMenuButtons(authentication:AppAuthentication | null): Observable<AppMenuButton[]>

    getUserMenuItems(authentication: AppAuthentication | null): Observable<MenuItem[]>

}
