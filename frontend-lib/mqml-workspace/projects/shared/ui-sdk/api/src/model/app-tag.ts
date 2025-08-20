export type AppTagSeverity  = 'success' | 'secondary' | 'info' | 'warn' | 'danger' | 'contrast' | undefined;

export interface AppTag {
  value?: string;
  icon?: string;
  severity?: AppTagSeverity;
  rounded?: boolean | undefined;
  tooltip?: string | undefined;
  tooltipPosition?: 'right' | 'left' | 'top' | 'bottom' | string | undefined;
  tooltipStyleClass?: string | undefined;
  tooltipEscape?: boolean;
  tooltipAppendTo?: string | undefined;
  click?: (event: MouseEvent) => void;
}
