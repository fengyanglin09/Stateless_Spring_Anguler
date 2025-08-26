import {AppEvent} from 'mqml-angular-ui-sdk/api';


export interface AppCommentListInputModel {
    id?: number;
    value?: string;
    published: boolean;
    version?: number;
}

export interface AppCommentListSaveEvent extends AppEvent, AppCommentListInputModel {

}

export interface AppCommentListDeleteEvent extends AppEvent {
    id?: number;
}

