export interface AppConfiguration {
  baseUrl: string
  applicationName: string;
  applicationDescription?: string;
  environmentName: string
  environmentRibbonVisible: boolean
  sessionMonitor: AppSessionMonitorConfiguration
  applicationFooter: AppApplicationFooterConfiguration;
}

export interface AppApplicationFooterConfiguration {
  leftContent: string;
  rightContent?: string;
}

export interface AppSessionMonitorConfiguration {
  enabled: boolean;
  idleDuration?: number;
  debug?: boolean;
}
