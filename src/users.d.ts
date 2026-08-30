interface Authentication {
  isAuthenticated: boolean;
  token?: string;
  mfa: boolean;
  username?: string;
  displayName?: string;
  personId?: number;
  enterpriseId?: number;
  enterprise?: string;
  authorities: string[];
  returnUrl?: string;
}

interface AuthenticationData {
  authentication: Authentication;
}

interface Role {
  id?: number;
  code: string;
  name: string;
  isActive: boolean;
  description?: string;
}

interface UserGroup {
  id?: number;
  name: string;
  isActive: boolean;
  description?: string;
  roleCollection?: Role;
}

interface User {
  id?: string;
  username: string;
  email?: string;
  creationDate: string;
  lastLogin?: string;
  isEnabled: boolean;
  person: Person;
  userGroupCollection?: UserGroup;
  secretImageUri?: string;
  mfa: boolean;
}

interface UserData {
  users: User[];
}

interface UserQueryVars {
  id: number;
}

interface JwtUser {
  username: string;
  person: Person;
  enterprise: Enterprise;
  authorities: string[];
  schoolCategory?: string;
}

interface AuthResponse {
  user: JwtUser;
  token: string;
  mfa: boolean;
}

interface Auth {
  authUser?: AuthResponse;
  loader: boolean;
  alertMessage: string;
  showMessage: boolean;
  initURL: string;
}
