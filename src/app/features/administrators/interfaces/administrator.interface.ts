export interface RoleInfo {
  roleId: number;
  name: string;
  description?: string;
}

export interface Administrator {
  id: number;
  name: string;
  lastName: string;
  email: string;
  username: string;
  phone: string | null;
  isVerified: boolean;
  status: string;
  isActive: boolean;
  lastLogin: string | null;
  photoUrl: string | null;
  photoMediumUrl: string | null;
  photoThumbnailUrl: string | null;
  createdAt: string;
  updatedAt: string;
  birthDate?: string | null;
  role: RoleInfo | null;
}

export interface CreateAdminDTO {
  name: string;
  lastName: string;
  username: string;
  email: string;
  password: string;
  phone?: string | null;
  isActive?: boolean;
  birthDate?: string | null;
  isVerified?: boolean;
  photoUrl?: string | null;
  photoMediumUrl?: string | null;
  photoThumbnailUrl?: string | null;
}

export interface UpdateAdminDTO {
  name?: string;
  lastName?: string;
  email?: string;
  username?: string;
  phone?: string;
  birthDate?: string | null;
  photoUrl?: string | null;
  photoMediumUrl?: string | null;
  photoThumbnailUrl?: string | null;
  roleId?: number | null;
  isActive?: boolean;
}

export interface ChangePasswordDTO {
  current: string;
  newPassword: string;
}

export interface AdminSearchUserDTO {
  term: string;
}

export interface AdminSearchUserResult {
  id: number;
  name: string;
  lastName: string;
  email: string;
}

export interface AdminListParams {
  search?: string;
  name?: string;
  email?: string;
  isActive?: boolean;
  roleId?: number;
  page?: number;
  limit?: number;
}
