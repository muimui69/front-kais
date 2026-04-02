

export interface Permission {
    permissionId: number;
    name: string;
}


export interface RefreshResponse {
    success: boolean;
    message: string;
    data: RefreshData;
}

export interface RefreshData{
    accessToken: string;
}



export interface LoginResponse {
    success: boolean;
    message: string;
    data: LoginData;
}


export interface LoginData {
    accessToken: string;
    refreshToken: string;
    tid: string;
    admin: AdminContext;
}


export interface AdminContext {
    id: number;
    name: string;
    lastName: string;
    email: string;
    username: string;
    phone: string | null;
    isActive: boolean;
    isVerified?: boolean;
    status?: string;
    lastLogin?: string | null;
    photoUrl: string | null;
    photoMediumUrl?: string | null;
    photoThumbnailUrl?: string | null;
    role: Role | null;
    fullName?: string;
}


export interface User {
    id: number;
    name: string;
    lastName: string;
    email: string;
    username: string;
    phone: string | null;
    photoUrl: string | null;
    role: Role;
    fullName: string;
    permissions: Permission[];
}

export interface Role {
    roleId: number;
    name: string;
}
