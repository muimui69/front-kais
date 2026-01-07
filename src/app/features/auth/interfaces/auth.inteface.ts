

export interface Permission {
    permissionId: number;
    name: string;
}


export interface RefreshResponse {
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
    isActive: boolean;
    user: User;
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
}

export interface Role {
    roleId: number;
    name: string;
}
