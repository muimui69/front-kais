export interface Role {
  roleId: number;
  roleName: string;
  roleDescription: string;
  isActive: boolean;
  createdAt: string;
}

export interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface RolePaginated {
  items: Role[];
  pagination: PaginationInfo;
}

export interface RolePermissionsData {
  role: {
    roleId: number;
    name: string;
    description: string;
  };
  permissionStructure: any[];
  totalPermissions: number;
  permissionIds: number[];
}

export interface CreateRoleDTO {
  roleName: string;
  roleDescription?: string;
}

export interface UpdateRoleDTO {
  roleName?: string;
  roleDescription?: string;
}

export interface AssignPermissionsDTO {
  permissionsIds: number[];
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface PaginatedApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  pagination: PaginationInfo;
}
