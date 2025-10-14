import {computed, effect, Injectable, signal, Signal, WritableSignal} from '@angular/core';
import {map, Observable, of, Subject} from 'rxjs';
import {MenuItem} from 'primeng/api';
import {AppConfiguration} from '../models/app.configuration.model';

export type MenuMode = 'static' | 'overlay' | 'slim-plus' | 'slim' | 'horizontal' | 'reveal' | 'drawer';

export interface layoutConfig {
    primary: string;
    surface: string | undefined | null;
    darkTheme: boolean;
    menuMode: MenuMode;
    menuTheme: string;
    topbarTheme: string;
    menuProfilePosition: string;
}

export interface LayoutState {
    staticMenuDesktopInactive: boolean;
    overlayMenuActive: boolean;
    configSidebarVisible: boolean;
    staticMenuMobileActive: boolean;
    menuHoverActive: boolean;
    rightMenuActive: boolean;
    topbarMenuActive: boolean;
    sidebarActive: boolean;
    activeMenuItem: any;
    overlaySubmenuActive: boolean;
    anchored: boolean;
    menuProfileActive: boolean;
}

export interface MenuChangeEvent {
    key: string;
    routeEvent?: boolean;
}


@Injectable({
    providedIn: 'root'
})
export class LayoutService {
    _config: layoutConfig = {
        primary: 'blue',
        surface: null,
        darkTheme: false,
        menuMode: 'overlay',
        menuTheme: 'light',
        topbarTheme: 'blue',
        menuProfilePosition: 'end'
    };

    _state: LayoutState = {
        staticMenuDesktopInactive: false,
        overlayMenuActive: false,
        configSidebarVisible: false,
        staticMenuMobileActive: false,
        menuHoverActive: false,
        rightMenuActive: false,
        topbarMenuActive: false,
        sidebarActive: false,
        anchored: false,
        activeMenuItem: null,
        overlaySubmenuActive: false,
        menuProfileActive: false
    };

    layoutConfig = signal<layoutConfig>(this._config);

    layoutState = signal<LayoutState>(this._state);

    private configUpdate = new Subject<layoutConfig>();

    private resetSource = new Subject();


    transitionComplete: WritableSignal<boolean> = signal<boolean>(false);

    isSidebarStateChanged = computed(() => {
        const layoutConfig = this.layoutConfig();
        return layoutConfig.menuMode === 'horizontal' || layoutConfig.menuMode === 'slim' || layoutConfig.menuMode === 'slim-plus';
    });

    private initialized = false;

    constructor() {
        effect(() => {
            const config = this.layoutConfig();
            if (config) {
                this.onConfigUpdate();
            }
        });

        effect(() => {
            const config = this.layoutConfig();

            if (!this.initialized || !config) {
                this.initialized = true;
                return;
            }

            this.handleDarkModeTransition(config);
        });

        effect(() => {
            this.isSidebarStateChanged() && this.reset();
        });
    }

    private handleDarkModeTransition(config: layoutConfig): void {
        console.log('DarkMode Transition Config:', config);
        if ((document as any).startViewTransition) {
            this.startViewTransition(config);
        } else {
            this.toggleDarkMode(config);
            this.onTransitionEnd();
        }
    }

    private startViewTransition(config: layoutConfig): void {
        const transition = (document as any).startViewTransition(() => {
            this.toggleDarkMode(config);
        });

        transition.ready
            .then(() => {
                this.onTransitionEnd();
            })
            .catch(() => {});
    }

    toggleDarkMode(config?: layoutConfig): void {
        const _config = config || this.layoutConfig();
        if (_config.darkTheme) {
            document.documentElement.classList.add('app-dark');
        } else {
            document.documentElement.classList.remove('app-dark');
        }
    }

    private onTransitionEnd() {
        this.transitionComplete.set(true);
        setTimeout(() => {
            this.transitionComplete.set(false);
        });
    }

    onConfigUpdate() {
        this._config = { ...this.layoutConfig() };
        this.configUpdate.next(this.layoutConfig());
    }



    reset() {
        this.resetSource.next(true);
    }




    /**
     *
     * ===========================================================================================================
     * */

  getConfiguration(): Observable<AppConfiguration> {

    // return this.applicationService.fetchEnvironmentInfo()
    //   .pipe(
    //     map(info=> {
    //       return {
    //         baseUrl: environment.baseUrl,
    //         applicationName: this.title.getTitle(),
    //         environmentName: info.environment,
    //         environmentRibbonVisible: info.environmentRibbon ??= true,
    //         sessionMonitor: {
    //           enabled: true,
    //           idleDuration: 120 * 60 // 2 hours
    //         },
    //         applicationFooter: {
    //           leftContent: `<span> For immediate assistance, call Help Desk (4-5500) and reference ${this.title.getTitle()} (System ID: ${this.applicationCI}). Otherwise, <a target="_new" href="https://mcsm.service-now.com/serviceconnect?id=sc_cat_item_guide&amp;sys_id=5d3aa41387cacd900d4011783cbb359c&amp;sysparm_category=3c0d800bdb0560d49986166e1396190a" class="underline text-blue-600 font-medium">Submit a Ticket</a></span>`,
    //           rightContent: `© ${new Date().getFullYear()} Mayo Foundation for Medical Education and Research. All rights reserved.`
    //         }
    //       }
    //     })
    //   );

      return of({
        baseUrl: "",
        applicationName: "MQML App",
        environmentName: "Dev",
        environmentRibbonVisible: true,
        sessionMonitor: {
          enabled: true,
          idleDuration: 120 * 60 // 2 hours
        },
        applicationFooter: {
          leftContent: ``,
          rightContent: ``
        }
      })
  }



  sideMenuToggle: WritableSignal<boolean> = signal<boolean>(false);

  setSideMenuMobileActive(isActive: boolean): void {
    this.sideMenuToggle.set(isActive);
  }

  getSideMenuMobileActiveStatus(): boolean {
    return this.sideMenuToggle();
  }


}
