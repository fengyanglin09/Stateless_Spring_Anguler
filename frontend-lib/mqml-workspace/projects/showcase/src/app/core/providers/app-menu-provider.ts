import {Observable, of} from "rxjs";
import {Injectable} from "@angular/core";
import {MenuItem} from "primeng/api";
import {Router} from "@angular/router";
import {
  AppAuthentication,
  AppMenuButton,
  AppSearchMenu,
  AppSearchMenuItem
} from 'mqml-angular-ui-layout-sdk/layout-interface';


@Injectable()
export class AppMenuProvider implements AppMenuProvider {
    private mockCount = 0;

    constructor(private router: Router) {
        setInterval(() => {
            this.mockCount = Math.floor(Math.random() * 100); // or increment for testing
        }, 5000); // update every 5 seconds
    }

    getMainMenuItems(authentication: AppAuthentication): Observable<MenuItem[]> {
        return of([
            {
                label: 'Components',
                items: [
                    {
                        label: 'Button',
                        routerLink: ['/components/button']
                    },
                    {
                        label: 'Card',
                        routerLink: ['/components/card']
                    },
                    {
                        label: 'Comment Dialog',
                        routerLink: ['/components/comment-dialog']
                    },
                    {
                        label: 'Comment List',
                        routerLink: ['/components/comment-list']
                    },
                    {
                        label: 'Content Overflow Ellipsis',
                        routerLink: ['/components/content-overflow-ellipsis']
                    },
                    {
                        label: 'Dialog',
                        routerLink: ['/components/dialog']
                    },
                    {
                        label: 'Editor',
                        routerLink: ['/components/editor']
                    },
                    {
                        label: 'Label Field',
                        routerLink: ['/components/label-field']
                    },
                    {
                        label: 'Table',
                        routerLink: ['/components/table']
                    }
                ]
            },
            {
                separator: true
            },
            {
                label: 'Pages',
                items: [
                    {
                        label: 'Landing',
                        routerLink: ['/landing']
                    },
                    {
                        label: 'Landing (Custom BG)',
                        routerLink: ['/landing-custom']
                    },
                    {
                        label: 'Not Found',
                        routerLink: ['/not-found']
                    },
                    {
                        label: 'Access Denied',
                        routerLink: ['/access-denied']
                    },
                    {
                        label: 'Error',
                        routerLink: ['/error']
                    }
                ]
            }
        ])
    }

    getSearchMenu(authentication: AppAuthentication): Observable<AppSearchMenu> {
        return of({
            selectedIndex: 0,
            menuItems: [
                {
                    id: 'orderNumber',
                    label: 'Order Number',
                    icon: 'fa fa-vials',
                    searchParam: 'orderNumber',
                    searchMatchMode: 'contains'
                },
                {
                    id: 'cost',
                    label: 'Cost',
                    icon: 'fa-solid fa-dollar-sign',
                    searchParam: 'cost',
                    searchMatchMode: 'equals'
                }
            ],
            onSearch: (searchTerm: string, menuItem: AppSearchMenuItem) => {
                this.router.navigate(
                    ['/advanced-search'],
                    {
                        queryParams: {
                            ["query"]: this.serializeObject({
                                [menuItem.searchParam]: [{
                                    value: searchTerm,
                                    matchMode: menuItem.searchMatchMode,
                                    operator: "and"
                                }]
                            })
                        }
                    }
                );
                return of(void 0);
            }
        })
    }

    getTopBarMenuButtons(authentication: AppAuthentication | null): Observable<AppMenuButton[]> {
        return of([
            {
                id: 'notifications',
                badgeOverlay: true,
                badgeValue: '2',
                badgeValueResolver: () => this.getMockNotificationCount(),
                pollIntervalSeconds: 2, // poll every 2 seconds
                badgeSeverity: 'danger',
                badgeSize: 'small',
                badgeStyle: null,
                iconClass: 'fa-regular fa-bell',
                iconStyle: {'font-size': '1.75rem'},
                icon: '',
                items: [{
                    label: 'Help',
                    icon: 'fa-solid fa-book',
                    url: 'https://www.google.com'
                },
                    {
                        label: 'About',
                        icon: 'fa-solid fa-circle-info',
                        routerLink: '/about'
                    }]
            },
            {
                id: 'help',
                badgeOverlay: false,
                badgeStyle: null,
                icon: 'fa-solid fa-circle-question',
                items: [{
                    label: 'Help',
                    icon: 'fa-solid fa-book',
                    url: 'https://www.google.com'
                },
                    {
                        label: 'About',
                        icon: 'fa-solid fa-circle-info',
                        routerLink: '/about'
                    }]
            },
        ])
    }

    getUserMenuItems(authentication: AppAuthentication | null): Observable<MenuItem[]> {
        return of([{label: 'Profile', icon: 'fa-solid fa-user', routerLink: ['/profile']}])
    }

    private getMockNotificationCount = () => {
        return this.mockCount;
    };

    private serializeObject(data: any): string {
        return btoa(JSON.stringify(data));
    }


}

