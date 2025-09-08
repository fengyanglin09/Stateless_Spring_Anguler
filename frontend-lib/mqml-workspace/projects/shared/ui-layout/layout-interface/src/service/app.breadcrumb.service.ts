import {Injectable, TemplateRef} from '@angular/core';
import {Subject} from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class AppBreadcrumbService {

    actionTemplate = new Subject<TemplateRef<any> | null>();

    set(template: TemplateRef<any>): AppBreadcrumbService {
        this.actionTemplate.next(template);
        return this;
    }

    clear(): AppBreadcrumbService {
        this.actionTemplate.next(null);
        return this;
    }
}
