import {AppTag} from 'mqml-angular-ui-sdk/api';

export interface LabelFieldValueTemplate {
  type: 'static' | 'input'
  value?: string;
}


export interface LabelFieldTemplate {
  label: string;
  value?: LabelFieldValueTemplate;
  infoTooltip?: string;
  infoTooltipStyleClass?: string;
  styleClass?: string;
  tags?: AppTag[];
  overflowEllipsis?: boolean;
  customToolbar?: boolean;
}

export interface LabelFieldExample {
  id: string;
  title: string;
  styleClass?: string;
  templates: LabelFieldTemplate[];
}
