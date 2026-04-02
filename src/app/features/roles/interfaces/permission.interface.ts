export interface PermissionAction {
  permissionId: number;
  name: string;
  description: string;
  action: string;
  level: 3;
  order: number;
}

export interface PermissionSection {
  permissionId: number;
  name: string;
  description: string;
  section: string;
  level: 2;
  order: number;
  actions: PermissionAction[];
}

export interface PermissionModule {
  permissionId: number;
  name: string;
  description: string;
  module: string;
  level: 1;
  order: number;
  sections: PermissionSection[];
}
