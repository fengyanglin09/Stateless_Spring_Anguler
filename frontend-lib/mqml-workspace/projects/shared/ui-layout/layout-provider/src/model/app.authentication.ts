
export interface AppAuthentication {
  id?: number;
  lanId?: string;
  lastName?: string;
  firstName?: string;
  fullName?: string;
  emailAddress?: string;
  department?: string;
  jobTitle?: string;
  roles?: AppRole[];
  originalRoles?: AppRole[];
  photoUrl?: string;
  supportUser: boolean;
}

export interface AppRole {
  name: string;
  displayName: string;
  description: string;
}

