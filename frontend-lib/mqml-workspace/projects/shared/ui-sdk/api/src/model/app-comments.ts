import {AppUser} from './app-user';
import {AppWithInternal} from './app-internal';
import {AppTag} from './app-tag';


export interface CadComment extends AppWithInternal{
  id?: number;
  value: string;
  valueStyleClass?: string;
  user: AppUser;
  createdOn: Date;
  updatedOn?: Date | null;
  editedOn?: Date | null;
  deletedOn?: Date | null;
  publishedOn?: Date | null;
  tags?: AppTag[] | undefined;
  menuEnabled?: boolean;
  loading?: boolean;
}
