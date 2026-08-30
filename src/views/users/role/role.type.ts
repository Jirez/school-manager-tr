export interface RoleType {
  id: number;
  name: string;
  active: boolean;
  description: string;
  allPermissions: boolean;
  items: PermissionItem[];
}

export interface PermissionItem {
  groupName: string;
  checked: boolean;
  items: PermissionItemItem[];
}

export interface PermissionItemItem {
  id: number;
  code: string;
  checked: boolean;
}
