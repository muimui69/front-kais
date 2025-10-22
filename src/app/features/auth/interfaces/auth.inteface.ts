
export interface User {
    id: number;
    fullName: string;
    userName: string;
    email: string;
    role: Role;
    permissions: Permission[];
}

export interface Role {
    roleId: number;
    name: string;
}

export interface Permission {
    permissionId: number;
    name: string;
}

export interface LoginResponse {
    user: User;
    accessToken: string;
}

export interface RefreshResponse {
    accessToken: string;
}
