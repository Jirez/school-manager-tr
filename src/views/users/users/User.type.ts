export interface UserType {
  id?: number;
  username: string;
  email?: string;
  creationDate: any;
  lastLogin: any;
  isEnabled: boolean;
  mfa: boolean;
  person: any;
  personId: any;
  userGroupCollection: any;
  password: string;
  confirm: string;
  roles: any;
}
