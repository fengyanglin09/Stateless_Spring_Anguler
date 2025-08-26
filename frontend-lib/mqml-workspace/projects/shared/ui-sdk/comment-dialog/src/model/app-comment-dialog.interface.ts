import {AppEvent} from 'mqml-angular-ui-sdk/api';

export interface AppCommentDialogInputModel {
  id?: number;
  value?: string;
  published: boolean;
  version?: number;
}

export interface AppCommentDialogSaveEvent extends AppEvent, AppCommentDialogInputModel {

}

export interface AppCommentDialogDeleteEvent extends AppEvent {
  id?: number;
}

