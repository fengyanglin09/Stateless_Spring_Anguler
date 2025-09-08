import {Component, TemplateRef} from '@angular/core';
import {BehaviorSubject, filter} from 'rxjs';
import {ActivatedRouteSnapshot, NavigationEnd, Router, RouterLink} from '@angular/router';
import {AppBreadcrumbService} from 'mqml-angular-ui-layout-sdk/layout-interface';
import {untilDestroyed} from '@ngneat/until-destroy';
import {AsyncPipe, NgForOf, NgIf, NgTemplateOutlet} from '@angular/common';

interface Breadcrumb {
  label: string;
  url?: string;
}

@Component({
  selector: '[lib-app-breadcrumb]',
  imports: [
    NgTemplateOutlet,
    RouterLink,
    NgForOf,
    NgIf,
    AsyncPipe
  ],
  templateUrl: './app.breadcrumb.html',
  styleUrl: './app.breadcrumb.scss',
  host: {
    class: 'layout-breadcrumb-container'
  }
})
export class AppBreadcrumb {
  private readonly _breadcrumbs$ = new BehaviorSubject<Breadcrumb[]>([]);

  readonly breadcrumbs$ = this._breadcrumbs$.asObservable();
  actionTemplate: TemplateRef<any> | null = null;

  constructor(private router: Router,
              private breadcrumbService: AppBreadcrumbService) {
    this.router.events.pipe(filter((event) => event instanceof NavigationEnd)).subscribe((event) => {
      const root = this.router.routerState.snapshot.root;
      const breadcrumbs: Breadcrumb[] = [];
      this.addBreadcrumb(root, [], breadcrumbs);

      this._breadcrumbs$.next(breadcrumbs);
      this.actionTemplate = null;
    });
    breadcrumbService.actionTemplate
      .pipe(untilDestroyed(this))
      .subscribe((response: TemplateRef<any> | null) => {
        this.actionTemplate = response;
        console.log('Adding action template', response);
      })
  }

  private addBreadcrumb(route: ActivatedRouteSnapshot, parentUrl: string[], breadcrumbs: Breadcrumb[]) {
    const routeUrl = parentUrl.concat(route.url.map((url) => url.path));
    const breadcrumb = route.data['breadcrumb'];
    const parentBreadcrumb = route.parent && route.parent.data ? route.parent.data['breadcrumb'] : null;

    if (breadcrumb && breadcrumb !== parentBreadcrumb) {
      breadcrumbs.push({
        label: route.data['breadcrumb'],
        url: '/' + routeUrl.join('/')
      } );
    }

    if (route.firstChild) {
      this.addBreadcrumb(route.firstChild, routeUrl, breadcrumbs);
    }
  }
}
