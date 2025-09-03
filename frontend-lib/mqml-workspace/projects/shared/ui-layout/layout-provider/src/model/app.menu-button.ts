import {MenuItem} from "primeng/api";
import {Observable} from "rxjs";
import {AppStyle} from "mqml-angular-ui-sdk/api";

export interface AppMenuButton {
    id: string;
    badgeOverlay?: boolean;
    badgeValue?: string | number;
    badgeSeverity?: 'info' | 'success' | 'warn' | 'danger';
    badgeStyle: { [klass: string]: any } | null | undefined;
    badgeSize?: 'small' | 'large' | 'xlarge' | undefined;
    icon: string;
    iconStyle?: AppStyle;
    iconClass?: string;
    tooltip?: string;
    tooltipAppendTo?: string;
    tooltipPosition?: string;
    tooltipStyleClass?: string;
    tooltipZIndex?: string;

    items?: MenuItem[];
    click?: (event: MouseEvent) => void;
    badgeValueResolver?: () => number | Promise<number> | Observable<number>;
    pollIntervalSeconds?: number;
}
