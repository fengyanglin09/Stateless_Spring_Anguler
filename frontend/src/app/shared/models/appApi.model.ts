export declare type AppStyle = { [klass: string]: any; } | null | undefined;


export interface AppConfiguration {
  baseUrl: string
  applicationName: string;
  applicationDescription?: string;
  environmentName: string
  environmentRibbonVisible: boolean
  applicationFooter: AppApplicationFooterConfiguration;
}

export interface AppApplicationFooterConfiguration {
  leftContent: string;
  rightContent?: string;
}
