import {QueryParamsHandling} from "@angular/router";
import {MegaMenuItem, MenuItem, TooltipOptions} from "primeng/api";
import {AppStyle} from './app-style';

export interface AppMenuItem {
  label?: string;
  icon?: string;
  url?: string;
  items?: MenuItem[];
  expanded?: boolean;
  disabled?: boolean;
  visible?: boolean;
  target?: string;
  escape?: boolean;
  routerLinkActiveOptions?: any;
  separator?: boolean;
  badge?: string;
  tooltip?: string;
  tooltipPosition?: string;
  badgeStyleClass?: string;
  style?: AppStyle;
  styleClass?: string;
  title?: string;
  id?: string;
  automationId?: any;
  tabindex?: string;
  routerLink?: any;
  queryParams?: { [k: string]: any; };
  fragment?: string;
  queryParamsHandling?: QueryParamsHandling;
  preserveFragment?: boolean;
  skipLocationChange?: boolean;
  replaceUrl?: boolean;
  iconStyle?: AppStyle;
  iconClass?: string;
  state?: { [k: string]: any; };
  tooltipOptions?: TooltipOptions;

  command?(event: CadMenuItemCommandEvent): void;

  [key: string]: any;
}

export interface CadMegaMenuItem {
  label?: string;
  icon?: string;
  command?: (event?: any) => void;
  url?: string;
  items?: AppMenuItem[][];
  expanded?: boolean;
  disabled?: boolean;
  visible?: boolean;
  target?: string;
  routerLinkActiveOptions?: any;
  separator?: boolean;
  badge?: string;
  badgeStyleClass?: string;
  style?: any;
  styleClass?: string;
  iconStyle?: any;
  title?: string;
  id?: string;
  automationId?: any;
  tabindex?: string;
  routerLink?: any;
  queryParams?: { [k: string]: any; };
  fragment?: string;
  queryParamsHandling?: QueryParamsHandling;
  preserveFragment?: boolean;
  skipLocationChange?: boolean;
  replaceUrl?: boolean;
  state?: { [k: string]: any; };
}

export interface CadMenuItemCommandEvent {
  originalEvent?: Event;
  item?: MenuItem | MegaMenuItem;
  index?: number;
}
